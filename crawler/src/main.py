import asyncio
from twscrape import API, gather
from twscrape.logger import set_log_level


async def main():
    api = API("config/accounts.db")  # or API("path-to.db") – default is `accounts.db`
    
    # ADD ACCOUNTS (for CLI usage see next readme section)

    # API USAGE
    
    # search (latest tab)
    await gather(api.search("elon musk", limit=20))  # list[Tweet]
    # change search tab (product), can be: Top, Latest (default), Media
    await gather(api.search("elon musk", limit=20, kv={"product": "Top"}))
    
    # tweet info
    tweet_id = 20
    await api.tweet_details(tweet_id)  # Tweet
    await gather(api.retweeters(tweet_id, limit=20))  # list[User]
    
    # Note: this method have small pagination from X side, like 5 tweets per query
    await gather(api.tweet_replies(tweet_id, limit=20))  # list[Tweet]
    
    # get user by login
    user_login = "xdevelopers"
    await api.user_by_login(user_login)  # User
    
    # user info
    user_id = 2244994945
    await api.user_by_id(user_id)  # User
    await gather(api.following(user_id, limit=20))  # list[User]
    await gather(api.followers(user_id, limit=20))  # list[User]
    await gather(api.verified_followers(user_id, limit=20))  # list[User]
    await gather(api.subscriptions(user_id, limit=20))  # list[User]
    await gather(api.user_tweets(user_id, limit=20))  # list[Tweet]
    await gather(api.user_tweets_and_replies(user_id, limit=20))  # list[Tweet]
    await gather(api.user_media(user_id, limit=20))  # list[Tweet]
    
    # list info
    await gather(api.list_timeline(list_id=123456789))
    
    # trends
    await gather(api.trends("news"))  # list[Trend]
    await gather(api.trends("sport"))  # list[Trend]
    await gather(api.trends("VGltZWxpbmU6DAC2CwABAAAACHRyZW5kaW5nAAA"))  # list[Trend]
    
    # NOTE 1: gather is a helper function to receive all data as list, FOR can be used as well:
    async for tweet in api.search("elon musk"):
        print(111111)
        print(tweet.id, tweet.user.username, tweet.rawContent)  # tweet is `Tweet` object
    
    # NOTE 2: all methods have `raw` version (returns `httpx.Response` object):
    async for rep in api.search_raw("elon musk"):
        print(222222)
        print(rep.status_code, rep.json())  # rep is `httpx.Response` object
    
    # change log level, default info
    set_log_level("DEBUG")
    
    # Tweet & User model can be converted to regular dict or json, e.g.:
    doc = await api.user_by_id(user_id)  # User
    doc.dict()  # -> python dict
    doc.json()  # -> json string


if __name__ == "__main__":
    asyncio.run(main())
