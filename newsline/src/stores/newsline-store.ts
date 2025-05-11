import { TokenSymbol } from "@/types/newsline";
import { create } from "zustand";

interface NewslineState {
  selectedTokenSymbol: TokenSymbol;
  currentTimeRange: { from: number; to: number };

  setSelectedTokenSymbol: (symbol: TokenSymbol) => void;
  setTimeRange: (start: number, end: number) => void;
}

export const useNewslineStore = create<NewslineState>((set) => ({
  selectedTokenSymbol: "BTC",
  currentTimeRange: {
    from: 0 as number,
    to: 0 as number,
  },
  hoveredEvent: null,

  setSelectedTokenSymbol: (symbol) => set({ selectedTokenSymbol: symbol }),
  setTimeRange: (start, end) => set({ currentTimeRange: { from: start, to: end } }),
}));
