import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import { Tweet } from "@/types/tweet";

export type TokenSymbol = "BTC" | "ETH" | "SOL";

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  username: string;
  name: string;
  followers: number;
  score_metrics: number;
  opacity: number;
  percentage: number;
  isTop: boolean;
  fx?: number;
  fy?: number;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  source2target_score: number;
  target2source_score: number;
}

export interface GraphLinkRaw {
  source_id: string;
  target_id: string;
  source2target_score: number;
  target2source_score: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
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

export type ForceGraphHandle = ForceGraphMethods<
  NodeObject<GraphNode>,
  LinkObject<GraphNode, GraphLink>
>;

export type KolTweet = Pick<
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

export type KolTweetRaw = {
  totalPage: number;
  tweets: KolTweet[];
};

export interface ForceGraphParams {
  token: string;
  filter_time: number; // 毫秒时间戳
  filter_followers: number; // 最小粉丝数
  add_user_list: string[]; // array<BigInt>
  sub_user_list: string[]; // array<BigInt>
  ttl: number; // 天数
  volatility: number; // 波动率（-1 ~ 1）
  bubble_num: number; // 总节点数
  top_ratio: number; // Top 样本比例（0～1），如 0.3
  nodes?: GraphNode[];
}

export interface TweetParams {
  author_id: string; // 主用户 A
  label_id: string | null; // 可选：用户 B，与 A 的交互；为空时按 token 查询 A 自身数据
  token: string; // 当 label_id 为空时，按 token 筛选
  ttl: number; // 时间窗口天数
  page_size: number; // 每页条数
  page_num: number; // 页码，从 1 开始
  filter_time: number; // 参考时间戳 ms
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}