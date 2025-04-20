import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export interface ForceNode extends SimulationNodeDatum {
  id: string;
  name: string;
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

export type UserGraphRow = {
  author_id: string;
  username: string;
  name: string;
  followers: string;
  tweet_id: string;
  created: string; // 时间戳字符串
  label: string;
  label_followers: string;
  label_username: string;
  label_user_id: string;
  label_name: string;
  score: number;
  object_type: TargetObjectType;
  active_type: ActiveType;
  text: string;
  like_count: string;
  quote_count: string;
  retweet_count: string;
  reply_count: string;
  view_count: string | null;
  bookmarked_count: string;
};
