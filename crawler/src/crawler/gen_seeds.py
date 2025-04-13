"""
从给定的用户名种子文件获取对应的 id，并写入文件 `seeds.jsonl`
"""
import asyncio
import json
from twscrape import API

from src.utils import get_logger, get_config

logger = get_logger("gen_seeds")

CONFIG_FILE = "config/settings.yaml"
INPUT_FILE = "data/seeds.txt"
OUTPUT_FILE = "data/seeds.jsonl"


async def main():
    config = get_config(CONFIG_FILE)
    accounts_db = config.get("accounts_db")
    proxy = config.get("proxy")
    api = API(accounts_db, proxy=proxy)
    logger.info("开始获取用户 ID")
    with open(INPUT_FILE, "r", encoding="utf-8") as fin, \
            open(OUTPUT_FILE, "w", encoding="utf-8") as fout:
        usernames = [line.strip() for line in fin if line.strip()]
        
        for uname in usernames:
            try:
                user = await api.user_by_login(uname)
                seed = {"id": user.id, "username": user.username}
                fout.write(json.dumps(seed, ensure_ascii=False) + "\n")
                logger.info(f"@{uname} → {user.id}")
            except Exception as e:
                logger.warning(f"获取 @{uname} 失败：{e}")


if __name__ == "__main__":
    asyncio.run(main())
