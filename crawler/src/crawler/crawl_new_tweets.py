import asyncio
import json
from pathlib import Path
from datetime import datetime
from twscrape import API, UserRef
import aiofiles

from src.utils import (
    get_logger,
    get_time_tag,
    get_config,
    get_latest_file,
    serialize_links,
    serialize_place,
    serialize_card,
)

logger = get_logger("tweets")

VALUABLE_USERS_DIR = "data/valuable_users/"
TWEETS_DIR = "data/tweets/"

date_tag = get_time_tag()
NEW_TWEETS_FILE = f"{TWEETS_DIR}/tweets_by_valuable_{date_tag}.jsonl"

config = get_config()
ACCOUNTS_DB = config.get("accounts_db")
PROXY = config.get("proxy")
LIMIT_TWEETS = config.get("limit_tweets_per_user")
TWEET_CONCURRENCY = config.get("tweet_concurrency")
TWEET_BUFFER_SIZE = config.get("tweet_per_worker_buffer_size")

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


def extract_mentions(mentionedUsers: list[UserRef]) -> list[int]:
    return [u.id for u in mentionedUsers if u.id in valuable_user_ids]


from datetime import datetime, timezone  # 加上 timezone


def get_since_time_from_latest_file():
    latest_file = get_latest_file(TWEETS_DIR)
    if not latest_file:
        return None
    try:
        filename = Path(latest_file).stem  # 去掉 .jsonl 后缀
        # 文件名形如：tweets_by_valuable_20250330_153319
        parts = filename.split("_")
        if len(parts) >= 4:
            dt_str = parts[-2] + parts[-1]  # '20250330' + '153319'
            # 👇 加上 timezone.utc，让它变成 offset-aware datetime
            return datetime.strptime(dt_str, "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc)
    except Exception as e:
        logger.warning(f"无法从文件名解析时间：{latest_file}，错误：{e}")
    return None


async def worker(api: API, queue: asyncio.Queue, since_time: datetime | None):
    global count
    tweets_buffer = []
    
    async def save_tweet(tweet_data):
        line = json.dumps(tweet_data, ensure_ascii=False) + "\n"
        tweets_buffer.append(line)
        if len(tweets_buffer) >= TWEET_BUFFER_SIZE:
            await flush_buffer()
    
    async def flush_buffer():
        if not tweets_buffer:
            return
        async with write_lock:
            async with aiofiles.open(NEW_TWEETS_FILE, "a", encoding="utf-8") as sf:
                await sf.write("".join(tweets_buffer))
        tweets_buffer.clear()
    
    while not queue.empty():
        user_id = await queue.get()
        
        try:
            async for tweet in api.user_tweets(user_id, limit=LIMIT_TWEETS):
                if since_time and tweet.date < since_time:
                    break  # tweet 太老了，跳过该用户后续 tweet
                
                if not tweet.user.id in valuable_user_ids:
                    continue
                
                tweet_data = {
                    "id": tweet.id,
                    "url": tweet.url,
                    "author_id": tweet.user.id,
                    "text": tweet.rawContent,
                    "created_at": int(tweet.date.timestamp() * 1000),
                    "lang": tweet.lang,
                    "like_count": tweet.likeCount,
                    "quote_count": tweet.quoteCount,
                    "retweet_count": tweet.retweetCount,
                    "reply_count": tweet.replyCount,
                    "view_count": tweet.viewCount,
                    "bookmarked_count": tweet.bookmarkedCount,
                    "hashtags": tweet.hashtags,
                    "cashtags": tweet.cashtags,
                    "conversation_id": tweet.conversationId,
                    "links": serialize_links(tweet.links),
                    "mentions": extract_mentions(tweet.mentionedUsers),
                    "reply_to_id": tweet.inReplyToTweetId,
                    "reply_to_user_id": getattr(tweet.inReplyToUser, "id", None),
                    "retweeted_to_id": getattr(tweet.retweetedTweet, "id", None),
                    "quoted_to_id": getattr(tweet.quotedTweet, "id", None),
                    "place": serialize_place(tweet.place),
                    "coordinates": tweet.coordinates or None,
                    "source": tweet.source or None,
                    "source_url": tweet.sourceUrl or None,
                    "source_label": tweet.sourceLabel or None,
                    "card": serialize_card(tweet.card),
                    "possibly_sensitive": tweet.possibly_sensitive if tweet.possibly_sensitive is not None else None
                }
                
                await save_tweet(tweet_data)
            
            async with counter_lock:
                count += 1
                logger.info(f"用户 @{user_id} 爬取完成 ({count}/{len(valuable_user_ids)})")
        
        except Exception as e:
            logger.error(f"爬取用户 {user_id} 的推文失败：{e}")
        finally:
            await flush_buffer()
            queue.task_done()


async def crawl():
    api = API(ACCOUNTS_DB, proxy=PROXY)
    
    load_valuable_users()
    
    since_time = get_since_time_from_latest_file()
    logger.info(f"只抓取 {since_time} 之后的推文" if since_time else "抓取所有推文（无时间限制）")
    
    queue = asyncio.Queue()
    for valuable_user_id in valuable_user_ids:
        queue.put_nowait(valuable_user_id)
    
    workers = [
        asyncio.create_task(worker(api, queue, since_time))
        for _ in range(TWEET_CONCURRENCY)
    ]
    await queue.join()
    for w in workers:
        w.cancel()
    
    logger.info(f"所有数据保存至：{NEW_TWEETS_FILE}")


if __name__ == "__main__":
    asyncio.run(crawl())
