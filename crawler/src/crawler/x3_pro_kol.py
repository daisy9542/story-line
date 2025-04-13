import asyncio
import aiohttp
import aiofiles
import json
import os
from twscrape.api import API

from src.utils import get_config, get_logger, get_verified_type

logger = get_logger("x3_pro_kol")

config = get_config()
ACCOUNTS_DB = config.get("accounts_db")
PROXY = config.get("proxy")
MIN_FOLLOWERS = config.get("min_followers")

api = API(ACCOUNTS_DB, proxy=PROXY)

OUTPUT_DIR = "data/x3_pro_kol"
os.makedirs(OUTPUT_DIR, exist_ok=True)

LABEL_MAP = {
    1: "PVP",
    2: "名人",
    3: "Web3",
    4: "项目方",
    5: "颜值"
}


async def fetch_kol_page(session, label, page):
    url = "https://x3.pro/api/api/scraper/kol/kolPage"
    payload = {
        "pageNo": page,
        "pageSize": 100,
        "label": label,
        "orderType": 1
    }
    headers = {
        "Content-Type": "application/json",
        "authorization": "676d9bdb-465a-4925-a5fe-cf147dc440ee",
        "Cookie": "_ga=GA1.1.518868718.1743505409; _ga_DW3WMR7BTG=GS1.1.1743511782.2.1.1743515557.0.0.0; JSESSIONID=30D404803BF8587FD640F9580E0E2771",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }
    
    try:
        async with session.post(url, json=payload, headers=headers) as resp:
            if resp.status != 200:
                logger.warning(f"请求失败：{resp.status}，label={label} page={page}")
                return {}
            return await resp.json()
    except Exception as e:
        logger.error(f"请求发生异常：{e}，label={label} page={page}")
        return {}


async def fetch_twitter_info(screen_name):
    try:
        async for user in api.search_user(screen_name, limit=10):
            if user.username == screen_name:
                return {
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
    except Exception as e:
        logger.warning(f"获取 {screen_name} 信息失败: {e}")
        return None


async def process_subject(session, label, label_name):
    output_path = os.path.join(OUTPUT_DIR, f"kol_{label_name}.jsonl")
    page = 1
    has_next = True
    
    async with aiofiles.open(output_path, mode='w', encoding='utf-8') as f:
        while has_next:
            data = await fetch_kol_page(session, label, page)
            kols = data.get("result", {}).get("list", [])
            has_next = data.get("result", {}).get("hasNextPage", False)
            
            tasks = []
            for kol in kols:
                fans = kol.get("fanCount", 0)
                # if fans < MIN_FOLLOWERS:
                #     has_next = False
                #     break
                screen_name = kol.get("screenName")
                tasks.append(fetch_twitter_info(screen_name))
            
            results = await asyncio.gather(*tasks)
            for item in results:
                if item:
                    await f.write(json.dumps(item, ensure_ascii=False) + "\n")
            
            page += 1


async def main():
    async with aiohttp.ClientSession() as session:
        for label, label_name in LABEL_MAP.items():
            logger.info(f"开始处理主题：{label_name}")
            await process_subject(session, label, label_name)
        logger.info("所有主题已完成")


if __name__ == "__main__":
    asyncio.run(main())
