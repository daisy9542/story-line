import { UTCTimestamp } from "lightweight-charts";

export interface CandleRequestParams {
  instId: string; // 产品ID，例如 "BTC-USDT"
  bar?: string; // 粒度，例如 "1D"
  after?: string; // 请求早于某时间戳的数据
  before?: string; // 请求晚于某时间戳的数据
  limit?: string; // 返回数量，默认 100，最大 300；如果请求的历史数据接口，最大 100
}

export interface CandleDataRaw {
  id: number;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  amount: number;
  turnover: number;
  timestr: string;
}

export interface CandleData {
  id: number;
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}
