export interface TimelineEvent {
  id: string;
  author: string; // 新闻的作者
  title: string; // 新闻的标题
  content: string; // 新闻的内容
  publish_time: number; // 新闻的发布时间，时间戳
  guid: string; // 新闻的 URL
  keywords: string[]; // 新闻的关键词
  origin_id: string; // 新闻的 id
}
