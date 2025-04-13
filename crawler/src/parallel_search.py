"""
This example shows how to use twscrape to complete some queries in parallel.
To limit the number of concurrent requests, see examples/parallel_search_with_limit.py
"""

import asyncio

import twscrape


async def worker(api: twscrape.API, q: str):
    tweets = []
    try:
        async for doc in api.search(q):
            tweets.append(doc)
    except Exception as e:
        print(e)
    finally:
        return tweets


async def main():
    proxy = "http://127.0.0.1:7890"
    api = twscrape.API("config/accounts.db")
    # add accounts here or before from cli (see README.md for examples)
    # await api.pool.add_account("DazeMicro", "17764561990abc", "daisy.cf.52036@gmail.com", "17764561990abc", proxy=proxy, cookies="night_mode=2; _ga=GA1.2.964654013.1715954829; kdt=3QTqbZYVGqdiRxez7SVdAREVbFkEnmpZ9CufvPyF; gt=1904791784779374772; personalization_id=\"v1_WmgV0JpNOqege/9flpo7Yw==\"; __cf_bm=6I7Ytd5UgLeLlMj1MxWwZmTfR1CpsjeXzEo7Br.mnIw-1742979999-1.0.1.1-ZLT9iqR6jvZpNhzR2fy8Uot969mpj.HM8Up1YL.NVzMYRzVRFlJi8RcNTxl4s5HLplYB7KUjAU0wqnni4iVZWw2r6p2kE5ID9evZD6dRZ1Q; ads_prefs=\"HBIRAAA=\"; auth_multi=\"1214832595457855488:7d3b8377679fbedf5e6e183dd7cff70fe336bc4e\"; auth_token=12cf0676ab73cb3dadf271306e5695b6ac17dcdc; guest_id_ads=v1%3A174298034221134267; guest_id_marketing=v1%3A174298034221134267; guest_id=v1%3A174298034221134267; twid=u%3D1466071038828163079; ct0=74f19567f757c1dc0ebe15f6bff1e3ccc88584870727bab0e488ec6702fec78c6a519aa2541504f51c8c3ff6e4f6fe92e321878a7e89406ccc08f34a99087e6de3f270d5c0d8220feb125c83eeddb96e")
    await api.pool.add_account("Micro_Daze", "17764561990abc", "daisy52036@outlook.com", "17764561990abc", proxy=proxy, cookies="night_mode=2; _ga=GA1.2.964654013.1715954829; kdt=3QTqbZYVGqdiRxez7SVdAREVbFkEnmpZ9CufvPyF; dnt=1; gt=1904791784779374772; g_state={\"i_l\":0}; auth_multi=\"1466071038828163079:12cf0676ab73cb3dadf271306e5695b6ac17dcdc\"; auth_token=7d3b8377679fbedf5e6e183dd7cff70fe336bc4e; guest_id_ads=v1%3A174297554744988285; guest_id_marketing=v1%3A174297554744988285; guest_id=v1%3A174297554744988285; twid=u%3D1214832595457855488; ct0=ab1ac575cfedfc08306b66898dcc69e0924d598abdc8acc19973713e7506892620c4c4924f4e28d44a5db7a1b18a0813e62944be78b2c260bdb078d2baa13277117c050715032647dd48857e918e85e9; personalization_id=\"v1_WmgV0JpNOqege/9flpo7Yw==\"; lang=zh-cn; __cf_bm=6I7Ytd5UgLeLlMj1MxWwZmTfR1CpsjeXzEo7Br.mnIw-1742979999-1.0.1.1-ZLT9iqR6jvZpNhzR2fy8Uot969mpj.HM8Up1YL.NVzMYRzVRFlJi8RcNTxl4s5HLplYB7KUjAU0wqnni4iVZWw2r6p2kE5ID9evZD6dRZ1Q")
    await api.pool.login_all(["DazeMicro"])

    queries = ["elon musk", "tesla", "spacex", "neuralink", "boring company"]
    results = await asyncio.gather(*(worker(api, q) for q in queries))

    combined = dict(zip(queries, results))
    for k, v in combined.items():
        print(k, len(v))


if __name__ == "__main__":
    asyncio.run(main())