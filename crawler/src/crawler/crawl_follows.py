import asyncio
import json
from pathlib import Path
from twscrape import API
import aiofiles

from src.utils import (
    get_logger,
    get_time_tag,
    get_config,
    get_latest_file,
)

logger = get_logger("follows")

VALUABLE_USERS_DIR = "data/valuable_users/"
TWEETS_DIR = "data/follows/"

date_tag = get_time_tag()
NEW_FOLLOWS_FILE = f"{TWEETS_DIR}/follows_by_valuable_{date_tag}.jsonl"

config = get_config()
ACCOUNTS_DB = config.get("accounts_db")
PROXY = config.get("proxy")
LIMIT_FOLLOWS = config.get("limit_follows_per_user")
FOLLOW_CONCURRENCY = config.get("follow_concurrency")

Path(TWEETS_DIR).mkdir(parents=True, exist_ok=True)

count = 0
counter_lock = asyncio.Lock()
write_lock = asyncio.Lock()

valuable_user_ids = set()


def load_valuable_users():
    valuable_users_latest_file = get_latest_file(VALUABLE_USERS_DIR)
    if valuable_users_latest_file:
        with open(valuable_users_latest_file, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    data = json.loads(line)
                    valuable_user_ids.add(int(data["id"]))
                except Exception as e:
                    logger.warning(f"解析 {valuable_users_latest_file} 出错：{e}")
        logger.info(f"加载历史有价值用户文件 {valuable_users_latest_file}，共 {len(valuable_user_ids)} 个用户")


async def worker(api: API, queue: asyncio.Queue):
    global count
    
    while not queue.empty():
        user_id = await queue.get()
        following_list = []
        
        try:
            async for following in api.following(user_id, limit=LIMIT_FOLLOWS):
                if following.id in valuable_user_ids:
                    following_list.append(following.id)
            async with write_lock:
                async with aiofiles.open(NEW_FOLLOWS_FILE, "a", encoding="utf-8") as sf:
                    data = {
                        "id": user_id,
                        "following": following_list
                    }
                    await sf.write(json.dumps(data, ensure_ascii=False) + "\n")
            async with counter_lock:
                count += 1
                logger.info(f"用户 @{user_id} 爬取完成 ({count}/{len(valuable_user_ids)})")
        
        except Exception as e:
            logger.error(f"爬取用户 {user_id} 的正在关注失败：{e}")
        finally:
            queue.task_done()


async def crawl():
    api = API(ACCOUNTS_DB, proxy=PROXY)
    
    load_valuable_users()
    
    queue = asyncio.Queue()
    for valuable_user_id in valuable_user_ids:
        queue.put_nowait(valuable_user_id)
    
    workers = [
        asyncio.create_task(worker(api, queue))
        for _ in range(FOLLOW_CONCURRENCY)
    ]
    await queue.join()
    for w in workers:
        w.cancel()
    
    logger.info(f"所有数据保存至：{NEW_FOLLOWS_FILE}")


if __name__ == "__main__":
    asyncio.run(crawl())
