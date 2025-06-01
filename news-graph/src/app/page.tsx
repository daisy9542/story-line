import GraphContainer from "@/components/graph/graph-container";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-1 flex-col">
      <Header />

      <main className="relative flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 items-start">
          <div className="absolute top-8 left-8 h-[460px] w-[300px] z-50">
            <Sidebar />
          </div>
          <section className="flex-1 h-full z-20">
            <GraphContainer />
          </section>
        </div>
      </main>
    </div>
  );
}
