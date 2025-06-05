import GraphContainer from "@/components/graph/graph-container";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import AnalysisItem from "@/components/sidebar-list/analysis-item";

export default function Home() {
  const analysisData = [
    {
      title: "Event Background",
      content:
        "Renowned trader James Wynn conducted high-leverage Bitcoin trading on the Hyperliquid platform, sparking market attention.",
    },
    {
      title: "Viral Potential",
      content:
        "Stories of high-leverage trading and liquidations rapidly spread on social media, attracting discussions within the cryptocurrency community.",
    },
    {
      title: "Negative Event",
      content:
        "Multiple liquidations resulted in huge losses, exposing the vulnerability of high-risk trading.",
    },
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
            <div className="absolute top-6 right-6 h-[360px] w-[260px] overflow-hidden rounded-xl bg-[rgba(135,145,171,0.08)] p-3 z-100">
              <div className="flex h-full w-full flex-col gap-4 overflow-scroll">
                {analysisData.map((item, index) => {
                  return <AnalysisItem item={item} key={index} />;
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
