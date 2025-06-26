import React from "react";
import { IMarketData } from "@/types/report";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketDataProps {
  marketData: IMarketData;
}

export function MarketDataView({ marketData }: MarketDataProps) {
  if (!marketData.market_daily_change) {
    return <div className="text-center text-gray-500">无市场数据</div>;
  }

  const marketEntries = Object.entries(marketData.market_daily_change);

  // 分离股票和加密货币
  const stockMarkets = marketEntries.filter(([key]) => !key.includes("_USD"));
  const cryptoMarkets = marketEntries.filter(([key]) => key.includes("_USD"));

  // 按涨跌幅排序
  const sortMarkets = (markets: typeof marketEntries) => {
    return [...markets].sort((a, b) => {
      const aChange = parseFloat(a[1].daily_change_pct);
      const bChange = parseFloat(b[1].daily_change_pct);
      return bChange - aChange;
    });
  };

  const sortedStocks = sortMarkets(stockMarkets);
  const sortedCrypto = sortMarkets(cryptoMarkets);

  const MarketCard = ({ marketKey, marketInfo }: { marketKey: string; marketInfo: any }) => {
    const isPositive = !marketInfo.daily_change_pct.includes("-");

    return (
      <div
        key={marketKey}
        className="rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800"
        title={`${formatMarketName(marketKey)} - 波动率: ${marketInfo.volatility}, 价值变化: ${marketInfo.daily_change_value}`}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatMarketName(marketKey)}
          </h3>
          <div
            className={`flex items-center gap-1 self-start rounded-full px-2 py-1 text-xs font-medium ${
              isPositive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{marketInfo.daily_change_pct}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 股票指数 */}
      {sortedStocks.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {sortedStocks.map(([marketKey, marketInfo]) => (
            <MarketCard key={marketKey} marketKey={marketKey} marketInfo={marketInfo} />
          ))}
        </div>
      )}

      {/* 加密货币 */}
      {sortedCrypto.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {sortedCrypto.map(([marketKey, marketInfo]) => (
            <MarketCard key={marketKey} marketKey={marketKey} marketInfo={marketInfo} />
          ))}
        </div>
      )}
    </div>
  );
}

// 格式化市场名称
function formatMarketName(key: string): string {
  const nameMap: Record<string, string> = {
    DJIA: "^DJI", // 道琼斯工业平均指数
    FTSE_100: "^FTSE", // 富时 100 指数
    Nikkei_225: "^N225", // 日经 225 指数
    "S&P_500": "^GSPC", // 标准普尔 500 指数
    DAX: "^GDAXI", // 德国 DAX 指数
    BTC_USD: "BTC-USD", // 比特币对美元
    SOL_USD: "SOL-USD", // Solana 对美元
    ETH_USD: "ETH-USD", // 以太坊对美元
  };

  return nameMap[key] || key.replace("_", " ");
}
