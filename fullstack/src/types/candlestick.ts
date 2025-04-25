import { UTCTimestamp } from "lightweight-charts";

export interface CandleRequestParams {
  instId: string; // 产品ID，例如 "BTC-USDT"
  bar?: string; // 粒度，例如 "1m", "5m", "1H", "1Dutc"
  after?: string; // 请求早于某时间戳的数据
  before?: string; // 请求晚于某时间戳的数据
  limit?: string; // 返回数量，默认 100，最大 300；如果请求的历史数据接口，最大 100
}

export interface CandleData {
  time: UTCTimestamp; // 开始时间，Unix 毫秒时间戳
  open: number; // 开盘价
  high: number; // 最高价
  low: number; // 最低价
  close: number; // 收盘价
  volume: number; // 交易量（交易币种）
  volumeBase: number; // 交易量（计价币种）
  volumeQuote: number; // 交易量（以计价币种为单位）
  confirm: boolean; // K 线状态是否完成
}

export type RawCandleData = [
  string, // 0: timestamp
  string, // 1: open
  string, // 2: high
  string, // 3: low
  string, // 4: close
  string, // 5: volume
  string, // 6: volumeBase
  string, // 7: volumeQuote
  "0" | "1", // 8: isClosed
];
