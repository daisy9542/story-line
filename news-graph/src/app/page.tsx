import GraphContainer from "@/components/graph-container";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-col">
      <div className="border-grid flex flex-1 flex-col">
        <Header />

        <main className="flex flex-1 flex-col">
          <div className="container-wrapper">
            <div className="container flex-1 items-start md:grid md:grid-cols-[300px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-10">
              <Sidebar />
              <GraphContainer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
