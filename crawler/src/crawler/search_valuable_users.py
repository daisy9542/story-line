import asyncio
import json
import os
from pathlib import Path

from twscrape import API, User
import logging
import aiofiles

from src.utils import (
    get_logger, get_config, get_time_tag, get_verified_type,
    get_latest_file, get_worker_idx, call_llm
)

logger = get_logger("search_users")
twscrape_logger = logging.getLogger("twscrape")
twscrape_logger.setLevel(logging.INFO)
for handler in logger.handlers:
    twscrape_logger.addHandler(handler)
twscrape_logger.propagate = False  # 避免重复日志

SEEDS_FILE = "data/seeds.jsonl"
VALUABLE_USERS_DIR = "data/valuable_users/"
SEEN_USERS_DIR = "data/seen_users/"
Path(SEEN_USERS_DIR).mkdir(parents=True, exist_ok=True)
time_tag = get_time_tag()
NEW_SEEN_USERS_FILE = f"{SEEN_USERS_DIR}/seen_users_{time_tag}.txt"
NEW_VALUABLE_USERS_FILE = f"{VALUABLE_USERS_DIR}/valuable_users_{time_tag}.jsonl"

config = get_config()
ACCOUNTS_DB = config["accounts_db"]
PROXY = config["proxy"]
MIN_FOLLOWERS = config["min_followers"]
LATEST_TWEETS_COUNT = config["latest_tweets_count"]
LIMIT_FOLLOWS_PER_USER = config["limit_follows_per_user"]
LLM_SEMAPHORE = config.get("llm_semaphore")
USER_CONCURRENCY = config.get("user_concurrency")
VALUABLE_USER_BUFFER_SIZE = config.get("valuable_user_buffer_size")
SEEN_USER_BUFFER_SIZE = config.get("seen_user_buffer_size")
MAX_RETRIES = config.get("max_retries")

Path(VALUABLE_USERS_DIR).mkdir(parents=True, exist_ok=True)
Path(os.path.dirname(NEW_SEEN_USERS_FILE)).mkdir(parents=True, exist_ok=True)
Path(os.path.dirname(NEW_VALUABLE_USERS_FILE)).mkdir(parents=True, exist_ok=True)

# 每个线程分配一个哈希表，避免锁竞争
seen_users_per_worker = [set() for _ in range(USER_CONCURRENCY)]

# 每个线程分配一个队列
# 为啥用 asyncio.Queue?
# 1. 队列空了，当前协程会自动挂起，不会阻塞事件循环。
# 2. 一旦有新任务加入队列，协程会被唤醒并继续执行。
queues = [asyncio.Queue() for _ in range(USER_CONCURRENCY)]

# 缓冲列表，当缓冲区长度达到一定阈值（如 100 条），就 flush 到文件。
seen_users_buffer = []
valuable_users_buffer = []

llm_semaphore = asyncio.Semaphore(LLM_SEMAPHORE)

seen_lock = asyncio.Lock()
write_lock = asyncio.Lock()

# 统计用户数量信息
all_users_num = 0
valuable_users_num = 0
counter_lock = asyncio.Lock()

# 最近一次获取到的有价值用户 ID 集合
old_valuable_users_set: set[int] = set()
# 最近一次获取到的已访问用户 ID 集合
old_seen_users_set: set[int] = set()

# 种子 ID 集合
seed_users: set[int] = set()


def distribute_seen_user(user_id: int):
    """ 根据用户 ID 将用户分配到对应的线程 """
    index = get_worker_idx(user_id, USER_CONCURRENCY)
    seen_users_per_worker[index].add(user_id)


def load_valuable_users():
    """ 加载有价值用户文件并存储 """
    valuable_users_latest_file = get_latest_file(VALUABLE_USERS_DIR)
    if valuable_users_latest_file:
        with open(valuable_users_latest_file, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    data = json.loads(line)
                    old_valuable_users_set.add(int(data["id"]))
                except Exception as e:
                    logger.warning(f"解析 {valuable_users_latest_file} 出错：{e}")
        logger.info(f"加载历史有价值用户文件 {valuable_users_latest_file}，共 {len(old_valuable_users_set)} 个用户")


def load_seen_users():
    """ 加载已访问用户文件并存储 """
    seen_users_latest_file = get_latest_file(SEEN_USERS_DIR, suffix=".txt")
    if seen_users_latest_file:
        with open(seen_users_latest_file, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    data = json.loads(line)
                    old_seen_users_set.add(int(data))
                except Exception as e:
                    logger.warning(f"解析 {seen_users_latest_file} 出错：{e}")
        logger.info(f"加载历史已访问用户文件 {seen_users_latest_file}，共 {len(old_valuable_users_set)} 个用户")


def load_seed_users():
    """ 读取种子用户的 ID """
    global seed_users
    with open(SEEDS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            try:
                data = json.loads(line)
                seed_users.add(int(data["id"]))
            except Exception as e:
                logger.warning(f"解析种子用户数据失败：{line} {e}")
    logger.info(f"共读取 {len(seed_users)} 个种子用户")


async def is_valuable_user(api: API, user: User) -> bool:
    """ 判断用户是否有价值 """
    if user.id in old_valuable_users_set or user.id in seed_users:
        return True
    if user.followersCount < MIN_FOLLOWERS or user.id in old_seen_users_set:
        return False
    bio = user.rawDescription.strip()
    tweets = []
    
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async for tweet in api.user_tweets(user.id, limit=LATEST_TWEETS_COUNT):
                tweets.append(tweet.rawContent.strip())
            break  # 成功了就退出循环
        except Exception as e:
            logger.warning(f"第 {attempt} 次尝试获取用户 {user.id} 推文失败：{e}")
            if attempt < MAX_RETRIES:
                await asyncio.sleep(1)  # 可选，等待一下再重试
            else:
                logger.warning(f"多次尝试失败，跳过用户 {user.id}")
    prompt = f"""判断此人是否与区块链/Web3/加密货币有关，仅返回 True 或 False。

简介：
{bio}

推文：
{" | ".join(tweets[:LATEST_TWEETS_COUNT])}
"""
    try:
        async with llm_semaphore:
            result = await call_llm(prompt)
        logger.info(f"判断用户 {user.id}，LLM 返回结果：{result}")
        return result.strip().lower() == "true"
    except Exception as e:
        logger.warning(f"LLM 调用失败：{e}")
        return False


async def flush_buffers():
    """ 将缓冲区的数据写入文件 """
    async with write_lock:
        if not seen_users_buffer and not valuable_users_buffer:
            return
        logger.info(f"已访问 {len(seen_users_buffer)} 个用户, 发现 {len(valuable_users_buffer)} 个有价值用户")
        if seen_users_buffer:
            async with aiofiles.open(NEW_SEEN_USERS_FILE, "a", encoding="utf-8") as sf:
                await sf.write("".join(seen_users_buffer))
            seen_users_buffer.clear()
        
        if valuable_users_buffer:
            async with aiofiles.open(NEW_VALUABLE_USERS_FILE, "a", encoding="utf-8") as vf:
                await vf.write("".join(valuable_users_buffer))
            valuable_users_buffer.clear()


async def save_user(user: User, is_valuable: bool):
    global all_users_num, valuable_users_num
    line = json.dumps(user.id, ensure_ascii=False) + "\n"
    seen_users_buffer.append(line)
    
    async with counter_lock:
        all_users_num += 1
        if is_valuable:
            valuable_users_num += 1
    
    if is_valuable:
        user_data = {
            "id": user.id,
            "username": user.username,
            "name": user.displayname,
            "verified": user.verified,
            "verified_type": get_verified_type(user),
            "followers": user.followersCount,
            "bio": user.rawDescription,
            "created": int(user.created.timestamp() * 1000),
            "friendsCount": user.friendsCount,
            "statusesCount": user.statusesCount,
            "favouritesCount": user.favouritesCount,
            "listedCount": user.listedCount,
            "mediaCount": user.mediaCount,
        }
        line = json.dumps(user_data, ensure_ascii=False) + "\n"
        valuable_users_buffer.append(line)
    
    if (len(seen_users_buffer) >= SEEN_USER_BUFFER_SIZE or
            len(valuable_users_buffer) >= VALUABLE_USER_BUFFER_SIZE):
        await flush_buffers()


async def process_and_save_user(api, user, depth):
    try:
        worker_id = get_worker_idx(user.id, USER_CONCURRENCY)
        local_seen_users = seen_users_per_worker[worker_id]
        if user.id in local_seen_users:
            return
        local_seen_users.add(user.id)
        if user.followersCount < MIN_FOLLOWERS:
            return
        is_valuable = await is_valuable_user(api, user)
        if is_valuable:
            next_worker = get_worker_idx(user.id, USER_CONCURRENCY)
            await queues[next_worker].put((user.id, depth))
        await save_user(user, is_valuable)
        logger.info(f"处理用户 {user.id} 完成，深度: {depth}, 有价值: {is_valuable}")
    except Exception as e:
        logger.warning(f"处理用户 {user.id} 失败：{e}")


async def worker(api: API, worker_id: int):
    queue = queues[worker_id]
    
    while True:
        uid, depth = await queue.get()
        if uid in seed_users:
            seed_user = await api.user_by_id(uid)
            await save_user(seed_user, True)
        try:
            async for user in api.following(uid, limit=LIMIT_FOLLOWS_PER_USER):
                asyncio.create_task(process_and_save_user(api, user, depth + 1))
        
        except Exception as e:
            logger.warning(f"抓取用户 {uid} 失败：{e}")
        
        queue.task_done()


async def crawl():
    global all_users_num, valuable_users_num
    api = API(ACCOUNTS_DB, proxy=PROXY)
    
    load_valuable_users()
    load_seen_users()
    load_seed_users()
    
    for uid in seed_users:
        index = get_worker_idx(uid, USER_CONCURRENCY)
        # 初始 depth 设为 0
        queues[index].put_nowait((uid, 0))
        seen_users_per_worker[index].add(uid)
    
    # 启动 worker
    tasks = [asyncio.create_task(worker(api, i)) for i in range(USER_CONCURRENCY)]
    
    # 等待所有任务队列完成
    for queue in queues:
        await queue.join()
    
    # 停止 worker
    for t in tasks:
        t.cancel()
    
    # 刷新写入
    await flush_buffers()
    
    logger.info(f"共抓取 {all_users_num} 个用户，其中有价值用户 {valuable_users_num} 个")


if __name__ == "__main__":
    asyncio.run(crawl())
