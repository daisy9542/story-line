import { TokenSymbol } from "@/types/newsline";
import { create } from "zustand";

interface NewslineState {
  selectedTokenSymbol: TokenSymbol;
  currentTimeRange: { from: number; to: number };
  focusedEventId: string | null;

  setSelectedTokenSymbol: (symbol: TokenSymbol) => void;
  setTimeRange: (start: number, end: number) => void;
  setFocusedEventId: (id: string | null) => void;
}

export const useNewslineStore = create<NewslineState>((set) => ({
  selectedTokenSymbol: "BTC",
  currentTimeRange: {
    from: 0 as number,
    to: 0 as number,
  },
  focusedEventId: null,

  setSelectedTokenSymbol: (symbol) => set({ selectedTokenSymbol: symbol }),
  setTimeRange: (start, end) => set({ currentTimeRange: { from: start, to: end } }),
  setFocusedEventId: (id) => set({ focusedEventId: id }),
}));
