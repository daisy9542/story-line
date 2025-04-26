import { CandleData } from "@/types/candlestick";

/**
 * 计算一组 K 线的振幅（最高价 vs 最低价）
 *
 * @param candles K 线数组，至少要有一根
 * @returns 振幅百分比（保留两位小数），如果 low 为 0 则返回 0
 */
export function calcAmplitude(candles: CandleData[]): number {
  if (candles.length === 0) return 0;
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const high = Math.max(...highs);
  const low = Math.min(...lows);
  return low > 0 ? Number((((high - low) / low) * 100).toFixed(2)) : 0;
}

/**
 * 计算单根 K 线的涨跌幅（收盘 vs 开盘）
 *
 * @param candle 单根 K 线
 * @returns 百分比（保留两位小数），如果 open 为 0 则返回 0
 */
export function calcChangePct(candle: CandleData): number {
  return candle.open > 0
    ? Number((((candle.close - candle.open) / candle.open) * 100).toFixed(2))
    : 0;
}

/**
 * 计算「相对上一根」的涨跌幅
 *
 * @param prev 前一根 K 线
 * @param curr 当前根 K 线
 */
export function calcVsPrevious(prev: CandleData, curr: CandleData): number {
  return prev.close > 0
    ? Number((((curr.close - prev.close) / prev.close) * 100).toFixed(2))
    : 0;
}
