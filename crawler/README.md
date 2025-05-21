## 使用说明

### 爬取高价值用户

```shell
python ./src/crawler/search_valuable_users.py [OPTIONS]
```

三个场景：
1. **从头重新跑**：无参数，从种子出发，按粉丝阈值＋大模型判定，递归遍历关注链。
2. **节约成本续跑**：加 `-v`，加载并抓取之前标记为有价值的用户，加 `-r` 对加载的有价值老用户重新跑大模型判定。
3. **增量挖掘**：加 `-v -s`，跳过所有已访问用户的再判断，减少大模型调用成本。

建议使用 3 持续运行（减少初始成本），程序中断可恢复执行；使用 2 定期更新已访问用户信息。使用 `-o` 为两个脚本指定不同的目录，防止数据有冲突，因为程序初次运行是读取目录下的最新文件。可以使用 `-m` 指定粉丝数阈值。


## 配置文件属性解释

- `accounts_db`：账号数据库文件路径，用于 twscrape 框架
- `proxy`：代理设置
- `deepseek_api_key`：DeepSeek API Key
- `min_followers`：识别为有价值用户所需的最小粉丝数
- `latest_tweets_count`：抓取最新推文数量（用于大模型判断用户是否相关）
- `limit_follows_per_user`：每个用户最多抓取的关注者数量，尽量大以获取所有数据
- `limit_tweets_per_user`：每个用户最多抓取的推文数量，尽量大以获取所有数据
- `limit_replies`：每条推文最多抓取的回复数量，尽量大以获取所有数据
- `limit_retweets`：每条推文最多抓取的转推用户数量，尽量大以获取所有数据
- `max_no_value_depth`：在递归抓取回复时，允许的最大“无价值用户”深度（由于迭代，此字段已无用处，默认为 1）
- `valuable_user_buffer_size`：识别有价值用户时缓存的用户数量，用于批量写入
- `seen_user_buffer_size`：已识别（所有）用户时缓存的用户数量，用于批量写入
- `tweet_per_worker_buffer_size`：抓取推文时每个协程的缓冲写入数量
- `llm_semaphore`：同时调用大语言模型的最大并发数
- `user_concurrency`：抓取有价值用户时的并发协程数
- `tweet_concurrency`：抓取有价值用户的推文时的并发协程数
- `follow_concurrency`：抓取有价值用户关注列表时的并发协程数
- `max_retries`：请求失败时的最大重试次数

## 数据文件字段解释

`valuable_users_*.jsonl` 记录了通过关键词搜索抓取到的、满足最小粉丝数要求的 X 用户信息，每行是一个用户的 JSON 数据。

- `id`：用户的唯一 ID（Twitter 内部使用的 user ID，整数类型）
- `username`：用户的用户名（即 `@username`）
- `name`：用户的显示名称（昵称，可包含 emoji 或特殊字符）
- `verified`：表示该账号是否是“旧版认证”账号（legacy verified），即在 X Blue 推出之前获得认证的账户
- `verifiedType`：表示该账号当前的认证类型：
    - `"none"`：无认证类型（一般配合 `verified=true` 表示 legacy verified）
    - `"blue"`：订阅了 X Premium（原 Twitter Blue），蓝标用户
    - `"business"`：订阅了 X Verified Organizations（企业认证），即黄标用户
    - `"organization"`：与 `business` 类似，也表示组织认证（有时用于旧字段）
    - `"government"`：政府或官方机构账号，灰标用户。
    - `""`（空字符串）：未知或未提供（极少见）
- `followers`：粉丝数（该用户被多少人关注）
- `bio`：用户个人简介（原始字符串）
- `created`：账号创建时间，毫秒级时间戳
- `friendsCount`：关注数（该用户关注了多少人）
- `statusesCount`：推文数（该账号总共发了多少条推文，含转推、回复）
- `favouritesCount`：点赞数（该用户一共给多少条推文点了赞）
- `listedCount`：被添加进 X 列表的次数（可视为权重指标）
- `mediaCount`：发过的媒体类推文数（包含图片或视频的推文数量）

`tweets_by_valuable_*.jsonl` 记录了有价值用户的推文信息（包括原始发推和引用推文），每行是一个 Tweet 对象的 JSON。

- `id`：推文 ID
- `url`：推文的完整链接
- `author_id`：推文作者的用户 ID
- `text`：推文的原始内容文本（包括 @mention、#话题、链接等）
- `created_at`：推文的创建时间，毫秒级时间戳
- `lang`：推文的语言代码（如 `en`、`zh`、`ja` 等）
- `like_count`：推文被点赞的次数
- `quote_count`：推文被引用的次数
- `retweet_count`：推文被转推的次数
- `reply_count`：推文收到的回复数量
- `view_count`：推文被查看的次数
- `bookmarked_count`：推文被收藏的次数
- `hashtags`：推文中出现的 `#标签` 列表
- `cashtags`：推文中出现的 `$股票代码` 列表
- `conversation_id`：推文所属的对话线程 ID，用于识别一组相关推文
- `links`：推文中包含的所有链接对象，每一个对象包含以下属性
    - `url`：推文中链接的实际目标地址
    - `text`：显示在推文界面中的文本链接内容，用于界面展示，可能为空
    - `tcourl`：Twitter 短链，可能为空
- `mentions`：推文中提到的有价值用户的 ID 列表
- `reply_to_id`：如果该推文是回复某条推文，则为被回复推文的 ID，否则为空
- `reply_to_user_id`：如果该推文是回复某位用户，则为被回复用户的 ID，否则为空
- `retweeted_to_id`：如果该推文是转推，则为原始推文的 ID，否则为空
- `quoted_to_id`：如果该推文是引用转推，则为被引用推文的 ID，否则为空
- `place`：推文关联的地理位置信息对象，通常表示发推时附带的城市、国家等。字段结构如下：
    - `id`：位置的唯一标识符
    - `full_name`：位置的完整名称（如 "San Francisco, CA"）
    - `name`：位置的简称（如 "San Francisco"）
    - `type`：位置类型（如 city、admin、country 等）
    - `country`：所在国家名称（如 "United States"）
    - `country_code`：国家代码（如 "US"）
- `coordinates`：推文的经纬度坐标信息，若无则为空
- `source`：推文发布的来源（例如 "Twitter for iPhone"），可能为空
- `source_url`：推文来源的链接（例如 Twitter Web App 的跳转链接），可能为空
- `source_label`：推文来源的显示名称，可能为空
- `card`：推文附带的富媒体卡片信息，可能为空。不同类型的卡片用于展示不同形式的外部内容或互动功能，字段结构会因类型而异，需根据
  `_type` 字段区分不同卡片结构。常见类型包括：
    - `summary`（链接预览卡片）：用于展示网页链接的摘要信息，通常包含以下字段：
        - `title`：网页的标题
        - `description`：网页的描述文字
        - `url`：原始链接地址
        - `vanity_url`：用于展示的简短 URL（如 example.com）
        - `photo_url`：预览图片地址（可选）
        - `video_url`：预览视频地址（可选）
    - `poll`（投票卡片）：用于展示推文内嵌的投票活动，字段包括：
        - `options`：投票选项列表，每个选项包含：
            - `label`：选项的文本内容
            - `count`：投票数（可能为 null）
            - `position`：选项的位置编号
        - `finished`：投票是否已经结束（布尔值）
    - `broadcast`（视频直播卡片）：用于展示 Twitter 的视频直播，字段包括：
        - `title`：直播的标题
        - `url`：直播跳转链接
        - `photo_url`：直播封面图地址
    - `audiospace`（音频直播卡片 / Twitter Spaces）：用于展示语音聊天室信息，字段包括：
        - `url`：Twitter Spaces 的跳转链接
    - 其他未知类型：会保留原始对象字段作为降级处理
- `possibly_sensitive`：该推文是否可能包含敏感内容，可能为空

## 项目目录

```txt
BlockTweet/
├── README.md
├── requirements.txt
├── config/
│   └── settings.yaml         # 配置文件
├── data/
│   ├── valuable_users/       # 有价值用户数据
│   ├── seen_users/           # 所有见过的用户以及上一次访问的时间
│   ├── tweets/               # 推文数据
│   └── follows/              # 关注列表数据
├── logs/                     # 相关日志目录
├── src/
│   ├── __init__.py
│   ├── main.py               # 项目主入口
│   ├── crawler/
│   │   ├── __init__.py
│   │   ├── gen_seeds.py      # 根据提供的种子用户名获取用户  ID
│   │   ├── search_valuable_users.py     # 搜索有价值用户
│   │   ├── crawl_tweets.py   # 根据有价值用户爬取推文、回复等
│   │   └── crawl_follows.py  # 爬取有价值用户的关注列表（经过过滤）
│   ├── parser/
│   ├── scripts/              # 一些辅助脚本
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py         # 日志工具
│   │   ├── helpers.py        # 常用函数、工具类
│   │   └── llm.py            # 大模型调用相关接口
├── accounts.db               # twscrape 框架可用账号列表。
└── .gitignore
```
