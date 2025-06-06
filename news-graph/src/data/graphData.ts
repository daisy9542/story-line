// src/data/graphData.ts

import { NodeType } from "@/types";

// 直接把你在问题里给的 JSON 复制过来，做成一个常量。
export const graphData = {
  nodes: [
    {
      id: "event-1",
      type: NodeType.EVENT,
      label: "SUI rebounds after $162 mln Cetus hack – Will lost funds make it home",
      level: 0,
      tags: ["Hack", "DeFi", "SUI"],
      time: 1748506980000
    },
    {
      id: "event-2",
      type: NodeType.EVENT,
      label: "How $330M was stolen without hacking: The dark power of social engineering",
      level: 1,
      tags: ["Hack", "ETH"],
      time: 1748516980000
    },
    {
      id: "org-sui-team",
      type: NodeType.GROUP,
      label: "SUI Team",
      level: 1
    },
    {
      id: "person-evan-cheng",
      type: NodeType.PERSON,
      label: "Evan Cheng",
      level: 1
    },
    {
      id: "person-adeniyi-abiodun",
      type: NodeType.PERSON,
      label: "Adeniyi Abiodun",
      level: 2
    },
    {
      id: "person-george-danezis",
      type: NodeType.PERSON,
      label: "George Danezis",
      level: 2
    },
    {
      id: "person-lexi-wangler",
      type: NodeType.PERSON,
      label: "Lexi Wangler",
      level: 1
    },
    {
      id: "Assets-sui",
      type: NodeType.ASSETS,
      label: "SUI",
      changePercent: 0.05,
      level: 1
    },
    {
      id: "Assets-cetus",
      type: NodeType.ASSETS,
      label: "Cetus",
      changePercent: 1.65,
      level: 1
    },
    {
      id: "Assets-sp500",
      type: NodeType.ASSETS,
      label: "S&P 500 Index",
      changePercent: -2.34,
      level: 2
    },
    {
      id: "person-trader-monkey",
      type: NodeType.PERSON,
      label: "Crypto Trader",
      level: 1
    }
  ],
  edges: [
    {
      id: "edge-1",
      source: "event-1",
      target: "org-sui-team",
      relationType: "involves",
      properties: {}
    },
    {
      id: "edge-2",
      source: "event-1",
      target: "Assets-cetus",
      relationType: "relatedAssets",
      properties: {}
    },
    {
      id: "edge-3",
      source: "event-1",
      target: "event-2",
      relationType: "similarEvent",
      properties: {}
    },
    {
      id: "edge-4",
      source: "event-1",
      target: "person-trader-monkey",
      relationType: "sentimentBearish",
      properties: {}
    },
    {
      id: "edge-5",
      source: "person-trader-monkey",
      target: "Assets-sui",
      relationType: "focusesOn",
      properties: {}
    },
    {
      id: "edge-6",
      source: "person-trader-monkey",
      target: "Assets-sp500",
      relationType: "focusesOn",
      properties: {}
    },
    {
      id: "edge-7",
      source: "event-1",
      target: "person-evan-cheng",
      relationType: "sentimentBearish",
      properties: {}
    },
    {
      id: "edge-8",
      source: "org-sui-team",
      target: "person-evan-cheng",
      relationType: "CEO",
      properties: {}
    },
    {
      id: "edge-9",
      source: "org-sui-team",
      target: "person-adeniyi-abiodun",
      relationType: "Co-Founder",
      properties: {}
    },
    {
      id: "edge-10",
      source: "org-sui-team",
      target: "person-george-danezis",
      relationType: "Chief Scientist",
      properties: {}
    },
    {
      id: "edge-11",
      source: "org-sui-team",
      target: "person-lexi-wangler",
      relationType: "Head of Communications",
      properties: {}
    },
    {
      id: "edge-12",
      source: "event-1",
      target: "person-lexi-wangler",
      relationType: "Investor",
      properties: {}
    },
    {
      id: "edge-13",
      source: "event-1",
      target: "Assets-sui",
      relationType: "marketReaction",
      properties: {}
    }
  ]
};
