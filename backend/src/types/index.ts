export interface User {
  id: number;
  username: string;
  name: string;
  verified: boolean;
  verifiedType:
    | "none"
    | "blue"
    | "business"
    | "organization"
    | "government"
    | "";
  followers: number;
  bio: string;
  created: number; // 时间戳 (毫秒)
  friendsCount: number;
  statusesCount: number;
  favouritesCount: number;
  listedCount: number;
  mediaCount: number;
}

// src/types/Tweet.ts
export interface Tweet {
  id: number;
  url: string;
  author_id: number;
  text: string;
  created_at: number;
  lang: string;
  like_count: number;
  quote_count: number;
  retweet_count: number;
  reply_count: number;
  view_count: number;
  bookmarked_count: number;
  hashtags: string[];
  cashtags: string[];
  conversation_id: string;
  mentions: number[];
  reply_to_id?: string | null;
  reply_to_user_id?: number | null;
  retweeted_to_id?: string | null;
  quoted_to_id?: string | null;
  place?: TweetPlace | null;
  coordinates?: TweetCoordinates | null;
  source?: string | null;
  source_url?: string | null;
  source_label?: string | null;
  card?: TweetCard | null;
  possibly_sensitive?: boolean | null;
}

// 地理位置
export interface TweetPlace {
  id: string;
  full_name: string;
  name: string;
  type: "city" | "admin" | "country" | string;
  country: string;
  country_code: string;
}

// 经纬度
export interface TweetCoordinates {
  lat: number;
  lon: number;
}

// 卡片信息：根据 _type 不同结构不同
export type TweetCard =
  | TweetCardSummary
  | TweetCardPoll
  | TweetCardBroadcast
  | TweetCardAudioSpace
  | UnknownTweetCard;

// 链接摘要卡片（网页预览）
export interface TweetCardSummary {
  _type: "summary";
  title: string;
  description: string;
  url: string;
  vanity_url?: string;
  photo_url?: string;
  video_url?: string;
}

// 投票卡片
export interface TweetCardPoll {
  _type: "poll";
  options: {
    label: string;
    count: number | null;
    position: number;
  }[];
  finished: boolean;
}

// 直播卡片
export interface TweetCardBroadcast {
  _type: "broadcast";
  title: string;
  url: string;
  photo_url: string;
}

// Twitter Spaces（音频直播）
export interface TweetCardAudioSpace {
  _type: "audiospace";
  url: string;
}

// 未知类型卡片：兜底保留
export interface UnknownTweetCard {
  _type: string;
  [key: string]: any;
}
