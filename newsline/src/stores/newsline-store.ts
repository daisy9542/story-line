import { TokenSymbol } from "@/types/newsline";
import { UTCTimestamp } from "lightweight-charts";
import { create } from "zustand";

interface NewslineState {
  selectedTokenSymbol: TokenSymbol;
  currentTimeRange: { start: UTCTimestamp; end: UTCTimestamp };

  setSelectedTokenSymbol: (symbol: TokenSymbol) => void;
  setTimeRange: (start: UTCTimestamp, end: UTCTimestamp) => void;
}

export const useNewslineStore = create<NewslineState>((set) => ({
  selectedTokenSymbol: "BTC",
  currentTimeRange: {
    start: 0 as UTCTimestamp,
    end: 0 as UTCTimestamp,
  },
  hoveredEvent: null,

  setSelectedTokenSymbol: (symbol) => set({ selectedTokenSymbol: symbol }),
  setTimeRange: (start, end) => set({ currentTimeRange: { start, end } }),
}));
