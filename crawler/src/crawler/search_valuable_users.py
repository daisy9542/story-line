import argparse
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


def parse_args():
    parser = argparse.ArgumentParser(description="爬取高价值用户并保存到本地")
    parser.add_argument(
        "--output-dir", "-o",
        default="data",
        help="输出根目录，内部会自动创建 valuable_users/ 和 seen_users/ 子目录 (default: data)"
    )
    parser.add_argument(
        "--min-followers", "-m",
        type=int,
        help="粉丝数阈值，默认取 config 中的值"
    )
    parser.add_argument(
        "--load-valuable-users", "-v",
        action="store_true",
        help="启动时加载历史高价值用户 ID，并对它们执行抓取"
    )
    parser.add_argument(
        "--load-seen-users", "-s",
        action="store_true",
        help="启动时加载历史已访问用户 ID，只用于跳过，不抓取"
    )
    parser.add_argument(
        "--rejudge", "-r",
        action="store_true",
        help="对加载的历史高价值用户，是否重新调用 LLM 判断；否则默认按高价值直接保存"
    )
    return parser.parse_args()


def setup_paths(base_dir: str):
    base = Path(base_dir)
    seeds_file = base / "seeds.jsonl"
    valuable_dir = base / "valuable_users"
    seen_dir = base / "seen_users"
    valuable_dir.mkdir(parents=True, exist_ok=True)
    seen_dir.mkdir(parents=True, exist_ok=True)
    return str(seeds_file), str(valuable_dir), str(seen_dir)


async def main():
    # 解析参数 & 日志
    args = parse_args()
    logger = get_logger("search_users")
    twscrape_logger = logging.getLogger("twscrape")
    twscrape_logger.setLevel(logging.INFO)
    for h in logger.handlers:
        twscrape_logger.addHandler(h)
    twscrape_logger.propagate = False
    
    # 读取配置，命令行覆盖
    config = get_config()
    MIN_FOLLOWERS = args.min_followers if args.min_followers is not None else config["min_followers"]
    LATEST_TWEETS_COUNT = config["latest_tweets_count"]
    LIMIT_FOLLOWS_PER_USER = config["limit_follows_per_user"]
    USER_CONCURRENCY = config["user_concurrency"]
    VALUABLE_USER_BUFFER_SIZE = config["valuable_user_buffer_size"]
    SEEN_USER_BUFFER_SIZE = config["seen_user_buffer_size"]
    MAX_RETRIES = config["max_retries"]
    PROXY = config["proxy"]
    ACCOUNTS_DB = config["accounts_db"]
    
    # 输出路径
    SEEDS_FILE, VALUABLE_USERS_DIR, SEEN_USERS_DIR = setup_paths(args.output_dir)
    time_tag = get_time_tag()
    NEW_SEEN_USERS_FILE = f"{SEEN_USERS_DIR}/seen_users_{time_tag}.txt"
    NEW_VALUABLE_USERS_FILE = f"{VALUABLE_USERS_DIR}/valuable_users_{time_tag}.jsonl"
    
    # 内存结构初始化
    seen_users_per_worker = [set() for _ in range(USER_CONCURRENCY)]
    queues = [asyncio.Queue() for _ in range(USER_CONCURRENCY)]
    seen_buffer = []
    valuable_buffer = []
    write_lock = asyncio.Lock()
    counter_lock = asyncio.Lock()
    all_users_num = 0
    valuable_users_num = 0
    old_valuable_users = set()
    old_seen_users = set()
    seed_users = set()
    
    # 选择性加载历史数据
    def load_valuables():
        latest = get_latest_file(VALUABLE_USERS_DIR)
        if latest:
            with open(latest, encoding="utf-8") as f:
                for line in f:
                    try:
                        data = json.loads(line)
                        old_valuable_users.add(int(data["id"]))
                    except:
                        pass
            logger.info(f"加载历史高价值用户，共 {len(old_valuable_users)} 条")
    
    def load_seens():
        latest = get_latest_file(SEEN_USERS_DIR, suffix=".txt")
        if latest:
            with open(latest, encoding="utf-8") as f:
                for line in f:
                    try:
                        old_seen_users.add(int(json.loads(line)))
                    except:
                        pass
            logger.info(f"加载历史已访问用户，共 {len(old_seen_users)} 条")
    
    if args.load_valuable_users:
        load_valuables()
    if args.load_seen_users:
        load_seens()
        for uid in old_seen_users:
            idx = get_worker_idx(uid, USER_CONCURRENCY)
            seen_users_per_worker[idx].add(uid)
    
    # 加载种子用户
    with open(SEEDS_FILE, encoding="utf-8") as f:
        for line in f:
            uid = int(json.loads(line)["id"])
            seed_users.add(uid)
    logger.info(f"共读取 {len(seed_users)} 个种子用户")
    
    # 判断是否“高价值”
    async def is_valuable_user(api: API, user: User) -> bool:
        if user.id in seed_users or user.id in old_valuable_users:
            return True
        if user.followersCount < MIN_FOLLOWERS or user.id in old_seen_users:
            return False
        bio = user.rawDescription.strip()
        tweets = []
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                async for t in api.user_tweets(user.id, limit=LATEST_TWEETS_COUNT):
                    tweets.append(t.rawContent.strip())
                break
            except Exception as e:
                logger.warning(f"第{attempt}次拉推文失败: {e}")
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(1)
                else:
                    return False
        prompt = f"""判断此人是否与区块链/Web3/加密货币有关，仅返回 True 或 False。

简介：
{bio}

推文：
{" | ".join(tweets[:LATEST_TWEETS_COUNT])}
"""
        try:
            res = await call_llm(prompt)
            return res.strip().lower() == "true"
        except Exception as e:
            logger.warning(f"LLM 调用失败: {e}")
            return False
    
    # 缓冲写盘
    async def flush_buffers():
        async with write_lock:
            if seen_buffer:
                async with aiofiles.open(NEW_SEEN_USERS_FILE, "a", encoding="utf-8") as f:
                    await f.write("".join(seen_buffer))
                seen_buffer.clear()
            if valuable_buffer:
                async with aiofiles.open(NEW_VALUABLE_USERS_FILE, "a", encoding="utf-8") as f:
                    await f.write("".join(valuable_buffer))
                valuable_buffer.clear()
    
    # 保存用户到缓冲
    async def save_user(user: User, is_val: bool):
        nonlocal all_users_num, valuable_users_num
        seen_buffer.append(json.dumps(user.id, ensure_ascii=False) + "\n")
        async with counter_lock:
            all_users_num += 1
            if is_val:
                valuable_users_num += 1
        if is_val:
            info = {
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
            valuable_buffer.append(json.dumps(info, ensure_ascii=False) + "\n")
        if (len(seen_buffer) >= SEEN_USER_BUFFER_SIZE or
                len(valuable_buffer) >= VALUABLE_USER_BUFFER_SIZE):
            await flush_buffers()
    
    # 处理新用户（深度遍历）
    async def process_and_save_user(api, user: User, depth: int):
        try:
            idx = get_worker_idx(user.id, USER_CONCURRENCY)
            # 只有“既不是种子，也不是历史高价值”的 ID，
            # 才用 seen_users_per_worker 去跳过
            if (user.id in seen_users_per_worker[idx]
                and user.id not in seed_users
                and user.id not in old_valuable_users):
                return
            seen_users_per_worker[idx].add(user.id)
            
            if args.load_valuable_users and user.id in old_valuable_users:
                # 历史有价值：不重判就直接 true，否则走 LLM
                is_val = True if not args.rejudge else await is_valuable_user(api, user)
            else:
                # 普通新用户：先按粉丝数过滤，再叫 LLM 判断
                if user.followersCount < MIN_FOLLOWERS:
                    return
                is_val = await is_valuable_user(api, user)
            await save_user(user, is_val)
            
            # 如果新判定为高价值，继续深度遍历
            if is_val:
                await queues[idx].put((user.id, depth + 1, None))
        
        except Exception as e:
            logger.warning(f"处理用户 {user.id} 失败: {e}")
    
    # Worker 协程
    async def worker(api: API, worker_id: int):
        q = queues[worker_id]
        while True:
            uid, depth, tag = await q.get()
            try:
                # 对于 seed / 历史有价值，一律先拉用户详情，再走 process_and_save_user
                if tag in ("seed", "valuable"):
                    user = await api.user_by_id(uid)
                    # 走统一的判断+保存+遍历逻辑
                    await process_and_save_user(api, user, depth)
                else:
                    # 普通 UID 直接遍历关注，不再重复 fetch user_by_id
                    async for next_user in api.following(uid, limit=LIMIT_FOLLOWS_PER_USER):
                        asyncio.create_task(process_and_save_user(api, next_user, depth + 1))
            except Exception as e:
                logger.warning(f"Worker {worker_id} 处理 {uid} 失败: {e}")
            finally:
                q.task_done()
    
    # 启动爬取流程
    async def crawl():
        # 初始化 API
        api = API(ACCOUNTS_DB, proxy=PROXY)
        
        # 1) 种子用户入队
        for uid in seed_users:
            idx = get_worker_idx(uid, USER_CONCURRENCY)
            queues[idx].put_nowait((uid, 0, "seed"))
            seen_users_per_worker[idx].add(uid)
        
        # 2) 历史高价值用户入队（如果开启）
        if args.load_valuable_users:
            for uid in old_valuable_users:
                # 已在 seen 集合里，避免重复
                idx = get_worker_idx(uid, USER_CONCURRENCY)
                if uid not in seen_users_per_worker[idx]:
                    queues[idx].put_nowait((uid, 0, "valuable"))
                    seen_users_per_worker[idx].add(uid)
        
        # 启动并行 workers
        tasks = [asyncio.create_task(worker(api, i)) for i in range(USER_CONCURRENCY)]
        
        # 等待所有队列 drained
        for q in queues:
            await q.join()
        
        # 取消 workers，flush 最后剩余
        for t in tasks:
            t.cancel()
        await flush_buffers()
        
        logger.info(f"抓取完成：共处理用户 {all_users_num} 个，其中高价值 {valuable_users_num} 个")
    
    await crawl()


if __name__ == "__main__":
    asyncio.run(main())
