// 链接对象
export interface TweetLink {
  url: string; // 链接的实际目标地址
  text: string | null; // 显示在推文界面中的文本链接内容，可能为空
  tcourl: string | null; // Twitter 短链，可能为空
}

// 地理位置信息
export interface TweetPlace {
  id: string; // 位置的唯一标识符
  full_name: string; // 位置的完整名称（如 "San Francisco, CA"）
  name: string; // 位置的简称（如 "San Francisco"）
  type: string; // 位置类型（如 city、admin、country 等）
  country: string; // 所在国家名称（如 "United States"）
  country_code: string; // 国家代码（如 "US"）
}

// 卡片基础类型
export interface TweetCardBase {
  _type: string; // 卡片类型标识符
}

// 链接预览卡片
export interface SummaryCard extends TweetCardBase {
  _type: "summary";
  title: string; // 网页的标题
  description: string; // 网页的描述文字
  url: string; // 原始链接地址
  vanity_url: string; // 用于展示的简短 URL（如 example.com）
  photo_url?: string; // 预览图片地址（可选）
  video_url?: string; // 预览视频地址（可选）
}

// 投票选项
export interface PollOption {
  label: string; // 选项的文本内容
  count: number | null; // 投票数（可能为 null）
  position: number; // 选项的位置编号
}

// 投票卡片
export interface PollCard extends TweetCardBase {
  _type: "poll";
  options: PollOption[]; // 投票选项列表
  finished: boolean; // 投票是否已经结束
}

// 视频直播卡片
export interface BroadcastCard extends TweetCardBase {
  _type: "broadcast";
  title: string; // 直播的标题
  url: string; // 直播跳转链接
  photo_url: string; // 直播封面图地址
}

// 音频直播卡片
export interface AudioSpaceCard extends TweetCardBase {
  _type: "audiospace";
  url: string; // Twitter Spaces 的跳转链接
}

// 推文卡片联合类型
export type TweetCard = SummaryCard | PollCard | BroadcastCard | AudioSpaceCard | Record<string, any>;

// 推文主接口
export interface Tweet {
  id: string; // 推文 ID
  url: string; // 推文的完整链接
  author_id: string; // 推文作者的用户 ID
  text: string; // 推文的原始内容文本（包括 @mention、#话题、链接等）
  created: number; // 推文的创建时间，毫秒级时间戳
  lang: string; // 推文的语言代码（如 `en`、`zh`、`ja` 等）
  like_count: number; // 推文被点赞的次数
  quote_count: number; // 推文被引用的次数
  retweet_count: number; // 推文被转推的次数
  reply_count: number; // 推文收到的回复数量
  view_count: number | null; // 推文被查看的次数
  bookmarked_count: number; // 推文被收藏的次数
  hashtags: string[]; // 推文中出现的 `#标签` 列表
  cashtags: string[]; // 推文中出现的 `$股票代码` 列表
  conversation_id: string; // 推文所属的对话线程 ID，用于识别一组相关推文
  links: TweetLink[]; // 推文中包含的所有链接对象
  mentions: string[]; // 推文中提到的有价值用户的 ID 列表
  reply_to_id: string | null; // 如果该推文是回复某条推文，则为被回复推文的 ID，否则为空
  reply_to_user_id: string | null; // 如果该推文是回复某位用户，则为被回复用户的 ID，否则为空
  retweeted_to_id: string | null; // 如果该推文是转推，则为原始推文的 ID，否则为空
  quoted_to_id: string | null; // 如果该推文是引用转推，则为被引用推文的 ID，否则为空
  place: TweetPlace | null; // 推文关联的地理位置信息
  coordinates: [number, number] | null; // 推文的经纬度坐标信息，若无则为空
  source: string | null; // 推文发布的来源（例如 "Twitter for iPhone"），可能为空
  source_url: string | null; // 推文来源的链接（例如 Twitter Web App 的跳转链接），可能为空
  source_label: string | null; // 推文来源的显示名称，可能为空
  card: TweetCard | null; // 推文附带的富媒体卡片信息，可能为空
  possibly_sensitive: boolean | null; // 该推文是否可能包含敏感内容，可能为空
}