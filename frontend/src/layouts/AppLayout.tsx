import React from "react";
import TokenSelector from "@/components/TokenSelector";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen bg-[--color-bg-dark] text-white">
      <div className="fixed top-3 left-4 z-50 md:hidden">
        <TokenSelector />
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
