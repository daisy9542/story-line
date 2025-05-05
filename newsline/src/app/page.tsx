"use client";

import CandleChart from "@/components/candle-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import TokenSelector from "@/components/token-selector";
import NewsEvents from "@/components/news-events";
import { NewsEvent } from "@/types/news";
/**
 * 
,, 6803, null, 'What is Runes·X·Bitcoin(X) and How to Buy X?', 'With the evolving dynamics of the cryptocurrency market, innovative projects like RUNES·X·BITCOIN are gaining traction. Discussing the unique characteristics and potential impacts of these emerging digital assets is crucial. RUNES·X·BITCOIN is creating a significant buzz, with its community-driven approach and substantial token airdrops. Discover the unprecedented opportunity with RUNES·X·BITCOIN. Explore its unique features, benefits, and', '1720454294', 'https://en.coinotag.com/what-is-runes%c2%b7x%c2%b7bitcoinx-and-how-to-buy-x/', 'Guides', '229');
INSERT INTO local_test.coindesk_new_result (contentJson, id, authors, title, content, publish_time, guid, keywords, origin_id) VALUES ('{\'Entities\': [{\'text\': \'Matcha\', \'type\': \'Company\'}, {\'text\': \'DEXs\', \'type\': \'Product\'}, {\'text\': \'$10million\', \'type\': \'Numerical\'}], \'EventLabels\': [{\'event\': \'Matchaunveilsnewpriceengine\', \'label\': \'ProductLaunch\'}], \'SentimentScore\': 0.5, \'CausalInference\': [{\'trigger\': \'Newpriceenginelaunch\', \'cause\': \'Demandforefficientlarge-scaletrading\', \'effect\': \'Improvedtradeexecutionforwhales\'}], \'HistoricalAnalogues\': [{\'case\': "Uniswap\'sroutingoptimization", \'year\': \'2021\', \'similarity\': \'EnhancedDEXtradingefficiency\'}]}', 6779, null, 'Matcha Unveils New Price Engine For Whales Trading on DEXs', 'Traders will have access to “best routes” when executing trades up to $10 million.', '1721053764', 'https://thedefiant.io/news/defi/matcha-unveils-new-price-engine-for-whales-trading-on-dexs', '', '228');
INSERT INTO local_test.coindesk_new_result (contentJson, id, authors, title, content, publish_time, guid, keywords, origin_id) VALUES ('{\'Entities\': [{\'text\': \'Bitcoin\', \'type\': \'Cryptocurrency\'}, {\'text\': \'Bernsteinanalysts\', \'type\': \'Institution\'}, {\'text\': \'Trumpfactor\', \'type\': \'Concept\'}, {\'text\': \'BTCminers\', \'type\': \'Industry\'}], \'EventLabels\': [{\'event\': \'PoliticalshiftsimpactBitcoin\', \'label\': \'MarketVolatility\'}, {\'event\': "Bernsteinanalysts\'insights", \'label\': \'MarketAnalysis\'}], \'SentimentScore\': 0.3, \'CausalInference\': [{\'trigger\': \'Politicallandscapechanges\', \'cause\': \'U.S.leadershipuncertainty\', \'effect\': \'Bitcoinpricefluctuations\'}, {\'trigger\': \'Pro-Bitcoinadministrationpotential\', \'cause\': \'Regulatoryoptimism\', \'effect\': \'BTCminerprofitability\'}], \'HistoricalAnalogues\': [{\'case\': \'Bitcoinrallypost-2020U.S.election\', \'year\': \'2020\', \'similarity\': \'Politicalinfluenceoncrypto\'}]}', 6780, null, 'Goldilocks Scenario for Bitcoin: Bernstein Analysts Highlight ‘Trump Factor’ Amid Political Shifts', 'Bitcoin miners are poised to benefit amidst the evolving political landscape in the U.S., as the “Trump factor” plays a significant role. Recent political events have impacted Bitcoin prices, reflecting the market’s sentiments toward potential future leadership. Insights from Bernstein analysts highlight the potential for a favorable scenario for BTC miners under a pro-Bitcoin administration.', '1721053752', 'https://en.coinotag.com/goldilocks-scenario-for-bitcoin-bernstein-analysts-highlight-trump-factor-amid-political-shifts/', 'News|BTC', '228');

 */
export default function HomePage() {
  const newsEvents: NewsEvent[] = [
    {
      // 文章/报告的唯一标识符
      report_id: "21124-323546-525",
      // ---- 核心事件信息 ----
      // 事件的唯一标识符 (如果一个报告可能涉及多个核心事件，这个字段很重要)
      event_id: "EVT-RUNES-X-BTC-TRACTION-001",
      // 事件核心标题 (新增字段，比summary更精炼，比EventLabels.event更易读)
      event_title: "RUNES·X·BITCOIN 协议获得市场关注",
      // 事件影响力 (0~100)，数值越高越重要
      event_influence: 90,
      // 事件发生时间或报告时间 (新增字段，对于时间线展示很重要)
      event_timestamp: 1698402600, // 使用标准时间格式 ISO 8601
      // 事件摘要 (保留，提供详细背景)
      summary:
        "文章详细介绍了RUNES·X·BITCOIN协议，特别是其社区驱动方法和空投策略如何帮助其获得市场关注。",
      // 情绪评分 (-1 到 1)
      sentiment_score: 0.6,
      // 情绪标签 (新增字段，基于分数生成，便于直接显示)
      sentiment_label: "Positive", // (例如: Positive, Neutral, Negative)

      // ---- 事件相关要素 ----
      // 关键实体 (结构优化，增加类型和可选的规范名称/ID)
      key_entities: [
        {
          name: "AICoins", // 实体名称
          type: "CryptocurrencyCategory", // 实体类型 (使用清晰的分类)
          entity_id: "Q12345", // 可选：链接到知识库或数据库的ID
        },
      ],
      // 事件分类标签 (结构优化)
      event_categories: [
        {
          category_name: "Cryptocurrency Innovation", // 使用更易读的分类名称
          category_code: "CRYPTO_INNOV", // 可选：内部使用的代码
        },
      ],

      // ---- 因果关系分析 ----
      causal_analysis: [
        {
          // 主要原因/背景
          cause: "创新的项目特性", // Human-readable cause
          // 触发该因果链的具体动作/子事件
          trigger: "RUNES·X·BITCOIN 的社区驱动方法和空投", // Human-readable trigger
          // 直接导致的后果/影响
          effect: "市场关注度增加", // Human-readable effect
        },
      ],

      // ---- 历史相似事件 + 宏观和微观指数----
      historical_analogues: [
        {
          // 相似历史事件的描述
          historical_case_summary: "比特币空投",
          // 历史事件发生的大致日期/年份
          historical_event_date: "2017-03-25", // 统一日期格式
          // 与当前事件的相似之处
          similarity_description: "社区驱动的代币分发机制",
          // 指向相关历史事件/报告的ID (如有)
          related_report_id: "243657033-31251-51",
          // 市场波动指标
          market_indicator: {
            // 加密货币指数
            crypto: "-1%",
            // 道琼斯工业平均指数
            djia: "-3%",
            // 纳斯达克 100 指数
            ndx: "-1%",
          },
        },
      ],
    },
    {
      // 文章/报告的唯一标识符
      report_id: "21124-323546-525",
      // ---- 核心事件信息 ----
      // 事件的唯一标识符 (如果一个报告可能涉及多个核心事件，这个字段很重要)
      event_id: "EVT-RUNES-X-BTC-TRACTION-002",
      // 事件核心标题 (新增字段，比summary更精炼，比EventLabels.event更易读)
      event_title: "RUNES·X·BITCOIN 协议获得市场关注",
      // 事件影响力 (0~100)，数值越高越重要
      event_influence: 90,
      // 事件发生时间或报告时间 (新增字段，对于时间线展示很重要)
      event_timestamp: 1698402600, // 使用标准时间格式 ISO 8601
      // 事件摘要 (保留，提供详细背景)
      summary:
        "文章详细介绍了RUNES·X·BITCOIN协议，特别是其社区驱动方法和空投策略如何帮助其获得市场关注。",
      // 情绪评分 (-1 到 1)
      sentiment_score: 0.6,
      // 情绪标签 (新增字段，基于分数生成，便于直接显示)
      sentiment_label: "Positive", // (例如: Positive, Neutral, Negative)

      // ---- 事件相关要素 ----
      // 关键实体 (结构优化，增加类型和可选的规范名称/ID)
      key_entities: [
        {
          name: "AICoins", // 实体名称
          type: "CryptocurrencyCategory", // 实体类型 (使用清晰的分类)
          entity_id: "Q12345", // 可选：链接到知识库或数据库的ID
        },
      ],
      // 事件分类标签 (结构优化)
      event_categories: [
        {
          category_name: "Cryptocurrency Innovation", // 使用更易读的分类名称
          category_code: "CRYPTO_INNOV", // 可选：内部使用的代码
        },
      ],

      // ---- 因果关系分析 ----
      causal_analysis: [
        {
          // 主要原因/背景
          cause: "这是根因", // Human-readable cause
          // 触发该因果链的具体动作/子事件
          trigger: "Trigger 1", // Human-readable trigger
          // 直接导致的后果/影响
          effect: {
            cause: "这是子原因",
            trigger: "Trigger 2",
            effect: {
              cause: "这是子原因",
              trigger: "Trigger 3",
              effect: "这是最终效果",
            },
          },
        },
      ],

      // ---- 历史相似事件 + 宏观和微观指数----
      historical_analogues: [
        {
          // 相似历史事件的描述
          historical_case_summary: "比特币空投 (例如 Bitcoin Cash)",
          // 历史事件发生的大致日期/年份
          historical_event_date: "2017-03-25", // 统一日期格式
          // 与当前事件的相似之处
          similarity_description: "社区驱动的代币分发机制",
          // 指向相关历史事件/报告的ID (如有)
          related_report_id: "243657033-31251-51",
          // 市场波动指标
          market_indicator: {
            // 加密货币指数
            crypto: "-1%",
            // 道琼斯工业平均指数
            djia: "-3%",
            // 纳斯达克 100 指数
            ndx: "-1%",
          },
        },
      ],
    },
    {
      // 文章/报告的唯一标识符
      report_id: "21124-323546-525",
      // ---- 核心事件信息 ----
      // 事件的唯一标识符 (如果一个报告可能涉及多个核心事件，这个字段很重要)
      event_id: "EVT-RUNES-X-BTC-TRACTION-003",
      // 事件核心标题 (新增字段，比summary更精炼，比EventLabels.event更易读)
      event_title: "RUNES·X·BITCOIN 协议获得市场关注",
      // 事件影响力 (0~100)，数值越高越重要
      event_influence: 90,
      // 事件发生时间或报告时间 (新增字段，对于时间线展示很重要)
      event_timestamp: 1698402600, // 使用标准时间格式 ISO 8601
      // 事件摘要 (保留，提供详细背景)
      summary:
        "文章详细介绍了RUNES·X·BITCOIN协议，特别是其社区驱动方法和空投策略如何帮助其获得市场关注。",
      // 情绪评分 (-1 到 1)
      sentiment_score: 0.6,
      // 情绪标签 (新增字段，基于分数生成，便于直接显示)
      sentiment_label: "Positive", // (例如: Positive, Neutral, Negative)

      // ---- 事件相关要素 ----
      // 关键实体 (结构优化，增加类型和可选的规范名称/ID)
      key_entities: [
        {
          name: "AICoins", // 实体名称
          type: "CryptocurrencyCategory", // 实体类型 (使用清晰的分类)
          entity_id: "Q12345", // 可选：链接到知识库或数据库的ID
        },
      ],
      // 事件分类标签 (结构优化)
      event_categories: [
        {
          category_name: "Cryptocurrency Innovation", // 使用更易读的分类名称
          category_code: "CRYPTO_INNOV", // 可选：内部使用的代码
        },
      ],

      // ---- 因果关系分析 ----
      causal_analysis: [
        {
          // 主要原因/背景
          cause: "创新的项目特性", // Human-readable cause
          // 触发该因果链的具体动作/子事件
          trigger: "RUNES·X·BITCOIN 的社区驱动方法和空投", // Human-readable trigger
          // 直接导致的后果/影响
          effect: "市场关注度增加", // Human-readable effect
        },
      ],

      // ---- 历史相似事件 + 宏观和微观指数----
      historical_analogues: [
        {
          // 相似历史事件的描述
          historical_case_summary: "比特币空投 (例如 Bitcoin Cash)",
          // 历史事件发生的大致日期/年份
          historical_event_date: "2017-03-25", // 统一日期格式
          // 与当前事件的相似之处
          similarity_description: "社区驱动的代币分发机制",
          // 指向相关历史事件/报告的ID (如有)
          related_report_id: "243657033-31251-51",
          // 市场波动指标
          market_indicator: {
            // 加密货币指数
            crypto: "-1%",
            // 道琼斯工业平均指数
            djia: "-3%",
            // 纳斯达克 100 指数
            ndx: "-1%",
          },
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center justify-between px-4">
        <TokenSelector />
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 gap-3 overflow-hidden p-4">
        <section className="overflow-hidden min-h-[500px] flex min-w-0 flex-1 p-4 rounded-xl border border-gray-200 dark:border-[#171D24] dark:bg-[#111111]">
          <CandleChart />
        </section>
        <aside className="md:w-[350px] min-h-[500px] w-full flex-shrink-0 border rounded-xl border-gray-200 dark:border-[#171D24]">
          <NewsEvents newsEvents={newsEvents} />
        </aside>
      </div>
    </main>
  );
}
