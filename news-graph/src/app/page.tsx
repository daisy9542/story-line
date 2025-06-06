import GraphContainer from "@/components/graph/graph-container";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import AnalysisContainer from "@/components/sidebar-list/analysis-container";

export default function Home() {
  const eventTitle = "马斯克与特朗普关系破裂";
  const analysisData = [
    {
      title: "Event Background",
      content:
        "马斯克因反对特朗普税法案，与其公开交恶，关系破裂。",
    },
    {
      title: "Viral Potential",
      content:
        "高传播性，社交媒体热议，引发广泛关注。",
    },
    {
      title: "Negative Event",
      content:
        "马斯克指控特朗普涉Epstein文件，特斯拉股价大跌。",
    },
    {
      title: "Causal Inference",
      content:
        "特斯拉股价波动，政策不确定性增加",
    },
  ];

  const eventLines = [
    {
      "event": "马斯克批评特朗普税法案",
      "sentiment": -0.5,
      "date": "2025-05-28",
      "url": "https://t.co/WvhRceBIgt"
    },
    {
      "event": "马斯克退出特朗普顾问角色",
      "sentiment": -0.6,
      "date": "2025-05-29",
      "url": "https://t.co/NdWzqj27FT"
    },
    {
      "event": "特朗普公开表示对马斯克失望",
      "sentiment": -0.7,
      "date": "2025-06-05",
      "url": "https://www.theguardian.com"
    },
    {
      "event": "马斯克指控特朗普涉Epstein文件",
      "sentiment": -0.9,
      "date": "2025-06-05",
      "url": "https://www.cbsnews.com"
    },
    {
      "event": "特朗普威胁取消马斯克公司补贴",
      "sentiment": -0.8,
      "date": "2025-06-05",
      "url": "https://www.reuters.com"
    },
    {
      "event": "特斯拉股价下跌14%，市值损失1500亿",
      "sentiment": -0.9,
      "date": "2025-06-05",
      "url": "https://www.reuters.com"
    },
    {
      "event": "马斯克支持特朗普弹劾提议",
      "sentiment": -0.8,
      "date": "2025-06-05",
      "url": "https://www.usatoday.com"
    }
  ];

  return (
    <div className="relative flex h-screen flex-1 flex-col">
      <Header />

      <main className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex h-full w-full flex-1 items-start">
          <div className="h-full w-[314px]">
            <Sidebar />
          </div>
          <section className="relative z-20 h-full flex-1">
            <GraphContainer />
            <div className="absolute top-6 right-6 h-[500px] w-[320px] overflow-y-auto rounded-xl z-100">
              <AnalysisContainer
                eventTitle={eventTitle}
                analysisData={analysisData}
                eventLines={eventLines}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
