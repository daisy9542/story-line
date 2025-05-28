"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      time: "23m",
    },
    {
      id: "2",
      title:
        "SUI rebounds after $162 mln Cetus hack – Will lost funds make it home?",
      tags: ["Hack", "Destroy", "DeFi"],
      time: "23m",
    },
    {
      id: "3",
      title:
        "Bitcoin Whale Doubles Down With $1.25 Billion Long Bet on Hyperliquid",
      tags: ["Hack", "Destroy", "DeFi"],
      time: "23m",
    },
    {
      id: "4",
      title:
        "Crypto Investor Allegedly Tortured Tourist With a Chainsaw To Steal His Password",
      tags: ["Hack", "Destroy", "DeFi"],
      time: "23m",
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

  return (
    <aside className="h-[460px] w-full py-8">
      <div className="h-full overflow-scroll rounded-[12px] border border-[#8791AB]/20 bg-[rgba(135,145,171,0.08)] backdrop-blur-[30px]">
        <div className="p-2">
          <Input
            placeholder="Search news, company..."
            className="h-10 w-full rounded-[12px] bg-white px-4 py-2 placeholder-gray-400 focus:border-transparent focus:ring-0"
          />
        </div>
        <div className="px-4">
          <div className="flex gap-2 p-1">
            {tabList.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 cursor-pointer rounded-full py-1 text-center text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-white text-black"
                    : "text-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-104px)] p-2">
          <div className="flex flex-col space-y-2">
            {newsItems.map((item) => (
              <Card key={item.id} className="rounded-[12px]">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm leading-snug">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-3 pt-0">
                  <div className="flex space-x-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/20 px-2 py-1 text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-black/70">{item.time}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
