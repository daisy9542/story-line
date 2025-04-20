import { active, SimulationLinkDatum, SimulationNodeDatum } from "d3";

import { Tweet } from "@/types/tweet";

export type TokenSymbol = "BTC" | "ETH" | "SOL";

export interface ForceNode extends SimulationNodeDatum {
  id: string;
  name: string;
  username: string;
  followers: number;
  degree?: number;
  fx?: number;
  fy?: number;
}

export interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: string | ForceNode;
  target: string | ForceNode;
  score: number;
}

export interface GraphData {
  nodes: ForceNode[];
  links: ForceLink[];
}

export enum TargetObjectType {
  User = "user", // KOL
  Token = "token", // 代币
  Object = "object", // 非当前 KOL 列表的用户或者事物
}

export enum ActiveType {
  Retweeted = "retweeted", // 转发
  Quoted = "quoted", // 引用
  Liked = "liked", // 点赞
}

export type KolGraphRow = {
  author_id: string;
  username: string;
  name: string;
  followers: number;
  tweet_id: string;
  created: number; // 时间戳字符串
  label: string;
  label_followers: number;
  label_username: string;
  label_user_id: string;
  label_name: string;
  score: number;
  object_type: TargetObjectType;
  active_type: ActiveType;
  text: string;
  like_count: number;
  quote_count: number;
  retweet_count: number;
  reply_count: number;
  view_count: number | null;
  bookmarked_count: number;
};

export type KolTweetRaw = Pick<
  Tweet,
  | "created"
  | "text"
  | "like_count"
  | "quote_count"
  | "retweet_count"
  | "reply_count"
  | "view_count"
  | "bookmarked_count"
> & {
  tweet_id: string;
  object_type: TargetObjectType;
  active_type: ActiveType;
};
