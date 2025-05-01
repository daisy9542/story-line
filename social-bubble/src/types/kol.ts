export interface KOL {
  id: string; // 用户的唯一 ID
  username: string; // 用户名
  name: string; // 显示名称
  verified: number; // 是否是旧版认证账号，0 表示否，1 表示是
  verified_type:
    | "none"
    | "blue"
    | "business"
    | "organization"
    | "government"
    | ""; // 认证类型
  followers: number; // 粉丝数
  bio: string; // 个人简介
  created: number; // 账号创建时间（毫秒级时间戳）
  friendsCount: number; // 关注数
  statusesCount: number; // 推文数
  favouritesCount: number; // 点赞数
  listedCount: number; // 被添加进 X 列表的次数
  mediaCount: number; // 媒体类推文数
}

export interface SimpleKOL {
  id: string; // 用户的唯一 ID
  name: string; // 昵称
  username: string; // 用户名
  followers: number; // 粉丝数
  score_metrics: number; // 对币种的情绪分值，范围 -100 到 100
}
