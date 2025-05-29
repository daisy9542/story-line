import asyncio
import json
from pathlib import Path
from datetime import datetime, timezone
import aiofiles
from twscrape import API

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

DATA_DIR = Path("data/")
VALUABLE_USERS_DIR = DATA_DIR / "valuable_users"
TWEETS_DIR = DATA_DIR / "tweets"
TWEETS_ERROR_DIR = DATA_DIR / "errors"
TWEETS_DIR.mkdir(parents=True, exist_ok=True)
TWEETS_ERROR_DIR.mkdir(parents=True, exist_ok=True)

# File paths
date_tag = get_time_tag()
NEW_TWEETS_FILE = TWEETS_DIR / f"tweets_by_valuable_{date_tag}.jsonl"
LAST_TIMES_FILE = DATA_DIR / "user_last_tweet_times.json"
FAILURES_FILE = TWEETS_ERROR_DIR / f"failures_{date_tag}.jsonl"

config = get_config()
ACCOUNTS_DB = config.get("accounts_db")
PROXY = config.get("proxy")
LIMIT_TWEETS = config.get("limit_tweets_per_user")
MIN_TWEETS_PER_USER = config.get("min_tweets_per_user", 50)
TWEET_CONCURRENCY = config.get("tweet_concurrency")
TWEET_BUFFER_SIZE = config.get("tweet_per_worker_buffer_size")
MAX_RETRIES = 3

# Shared state
count = 0
counter_lock = asyncio.Lock()
write_lock = asyncio.Lock()
last_times_lock = asyncio.Lock()
valuable_user_ids = set()
last_tweet_times: dict[int, datetime] = {}


def load_valuable_users():
    latest_file = get_latest_file(VALUABLE_USERS_DIR)
    if latest_file:
        with open(latest_file, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    data = json.loads(line)
                    valuable_user_ids.add(int(data['id']))
                except Exception as e:
                    logger.warning(f"解析 {latest_file} 出错：{e}")
    logger.info(f"加载历史有价值用户文件 {latest_file}，共 {len(valuable_user_ids)} 个用户")


def load_last_times():
    if LAST_TIMES_FILE.exists():
        try:
            data = json.loads(LAST_TIMES_FILE.read_text(encoding='utf-8'))
            for uid, ts in data.items():
                last_tweet_times[int(uid)] = datetime.fromisoformat(ts)
            logger.info(f"Loaded last tweet times for {len(last_tweet_times)} users")
        except Exception as e:
            logger.warning(f"Failed to parse {LAST_TIMES_FILE}: {e}")


def save_last_time(user_id: int, dt: datetime):
    async def _save():
        async with last_times_lock:
            last_tweet_times[user_id] = dt
            # write full mapping
            async with aiofiles.open(LAST_TIMES_FILE, 'w', encoding='utf-8') as f:
                data = {str(uid): ts.isoformat() for uid, ts in last_tweet_times.items()}
                await f.write(json.dumps(data, ensure_ascii=False, indent=2))
    
    return _save()


async def process_user(api: API, user_id: int):
    since_time = last_tweet_times.get(user_id)
    user_latest: datetime | None = None
    tweets_buffer = []
    seen = 0
    
    async def save_buffer():
        if tweets_buffer:
            async with write_lock:
                async with aiofiles.open(NEW_TWEETS_FILE, 'a', encoding='utf-8') as sf:
                    await sf.write(''.join(tweets_buffer))
            tweets_buffer.clear()
    
    async def save_tweet_entry(tweet_data: dict):
        nonlocal user_latest, seen
        seen += 1
        dt = tweet_data['date']
        if not user_latest or dt > user_latest:
            user_latest = dt
        tweets_buffer.append(json.dumps(tweet_data, ensure_ascii=False) + "\n")
        if len(tweets_buffer) >= TWEET_BUFFER_SIZE:
            await save_buffer()
    
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async for tweet in api.user_tweets(user_id, limit=LIMIT_TWEETS):
                # update latest
                tweet_date = tweet.date.replace(tzinfo=timezone.utc)
                entry = {
                    'id': tweet.id,
                    'url': tweet.url,
                    'author_id': tweet.user.id,
                    'text': tweet.rawContent,
                    'created_at': int(tweet_date.timestamp() * 1000),
                    'date': tweet_date,
                    'lang': tweet.lang,
                    'like_count': tweet.likeCount,
                    'quote_count': tweet.quoteCount,
                    'retweet_count': tweet.retweetCount,
                    'reply_count': tweet.replyCount,
                    'view_count': tweet.viewCount,
                    'bookmarked_count': tweet.bookmarkedCount,
                    'hashtags': tweet.hashtags,
                    'cashtags': tweet.cashtags,
                    'conversation_id': tweet.conversationId,
                    'links': serialize_links(tweet.links),
                    'mentions': [u.id for u in tweet.mentionedUsers if u.id in valuable_user_ids],
                    'reply_to_id': tweet.inReplyToTweetId,
                    'reply_to_user_id': getattr(tweet.inReplyToUser, 'id', None),
                    'retweeted_to_id': getattr(tweet.retweetedTweet, 'id', None),
                    'quoted_to_id': getattr(tweet.quotedTweet, 'id', None),
                    'place': serialize_place(tweet.place),
                    'coordinates': tweet.coordinates or None,
                    'source': tweet.source or None,
                    'source_url': tweet.sourceUrl or None,
                    'source_label': tweet.sourceLabel or None,
                    'card': serialize_card(tweet.card),
                    'possibly_sensitive': getattr(tweet, 'possibly_sensitive', None)
                }
                # stop condition: older than since_time and seen enough
                if since_time and tweet_date < since_time and seen >= MIN_TWEETS_PER_USER:
                    break
                await save_tweet_entry(entry)
            
            await save_buffer()
            
            # update counter
            async with counter_lock:
                global count
                count += 1
                logger.info(f"用户 @{user_id} 爬取完成 ({count}/{len(valuable_user_ids)})")
            
            # save last tweet time
            if user_latest:
                await save_last_time(user_id, user_latest)
            return
        
        except Exception as e:
            logger.error(f"爬取用户 {user_id} 时出现错误（尝试 {attempt}/{MAX_RETRIES}）：{e}")
            if attempt == MAX_RETRIES:
                # record failure
                async with write_lock:
                    async with aiofiles.open(FAILURES_FILE, 'a', encoding='utf-8') as ff:
                        await ff.write(json.dumps({'id': user_id, 'error': str(e)}, ensure_ascii=False) + "\n")
            else:
                await asyncio.sleep(2)  # backoff


async def crawl():
    api = API(ACCOUNTS_DB, proxy=PROXY)
    
    load_valuable_users()
    load_last_times()
    
    queue = asyncio.Queue()
    for uid in valuable_user_ids:
        queue.put_nowait(uid)
    
    workers = [asyncio.create_task(_worker(api, queue)) for _ in range(TWEET_CONCURRENCY)]
    await queue.join()
    for w in workers:
        w.cancel()
    
    logger.info(f"所有数据保存至：{NEW_TWEETS_FILE}")


# alias to match previous function name
_worker = process_user

if __name__ == '__main__':
    asyncio.run(crawl())
