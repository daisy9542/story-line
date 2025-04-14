import React from "react";

import TokenSelector from "@/components/token-selector";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col">
      <div className="fixed left-4 top-3 z-50 md:hidden">
        <TokenSelector />
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
