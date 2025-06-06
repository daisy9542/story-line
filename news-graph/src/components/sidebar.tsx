"use client";

import React from "react";

import { Input } from "@/components/ui/input";

import NewsItem from "./sidebar-list/news-item";

interface NewsItem {
  id: string;
  title: string;
  tags: string[];
  time: string;
}

interface SidebarProps {
  newsItems?: NewsItem[];
}

export default function Sidebar({
  newsItems = [
    {
      id: "1",
      title:
        "Hyperliquid Soars, Sui vs Solana & Internet Capital Markets Explained Road PRO",
      tags: ["Hack", "Destroy", "DeFi"],
      time: "06/07 2025",
    },
    {
      id: "2",
      title:
        "SUI rebounds after $162 mln Cetus hack – Will lost funds make it home?",
      tags: ["Hack", "Destroy", "DeFi"],
      time: "06/07 2025",
    },
    {
      id: "3",
      title:
        "Bitcoin Whale Doubles Down With $1.25 Billion Long Bet on Hyperliquid",
      tags: ["Hack", "Destroy", "DeFi"],
      time: "06/07 2025",
    },
    {
      id: "4",
      title:
        "Crypto Investor Allegedly Tortured Tourist With a Chainsaw To Steal His Password",
      tags: ["Hack", "Destroy", "DeFi"],
      time: "06/07 2025",
    },
  ],
}: SidebarProps) {
  const tabList = [
    { value: "news", label: "News" },
    { value: "company", label: "Company" },
    { value: "Assets", label: "Assets" },
    { value: "Person", label: "Person" },
  ];
  const [activeTab, setActiveTab] = React.useState(tabList[0].value);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const handleClick = (id: string) => {
    setSelectedItem(id);
  };

  return (
    <aside className="h-full w-full overflow-hidden bg-[rgba(135,145,171,0.08)] pt-6">
      <div className="flex h-full flex-col border-r border-[#8791AB]/20">
        {/* <div className="space-y-3 px-4 pt-4 backdrop-blur-[30px]">
          <div className="flex gap-2">
            {tabList.map((tab) => (
              <button
                key={tab.value}
                disabled={tab.value !== "news"}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 cursor-pointer rounded-sm py-1 text-center text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                  activeTab === tab.value
                    ? "bg-[rgb(37,38,39)] text-white"
                    : "text-[rgb(162,163,164)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div> */}
        <div className="h-6 px-4 text-[18px] leading-6">🔥 Hot</div>
        <div className="flex-1 overflow-scroll backdrop-blur-[30px]">
          <div className="flex cursor-pointer flex-col">
            {newsItems.map((item) => (
              <NewsItem
                key={item.id}
                item={item}
                isSelected={item.id === selectedItem}
                onClick={handleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
