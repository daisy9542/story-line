import { TimelineEvent } from "@/types/timeline";
import { create } from "zustand";

interface NewslineState {
  selectedTokenSymbol: "BTC";
  currentRange: { start: Date; end: Date };
  hoveredEvent: TimelineEvent | null;

  setRange: (start: Date, end: Date) => void;
  setHoveredEvent: (event: TimelineEvent | null) => void;
}

export const useNewslineStore = create<NewslineState>((set) => ({
  selectedTokenSymbol: "BTC",
  currentRange: {
    start: new Date(),
    end: new Date(),
  },
  hoveredEvent: null,

  setRange: (start, end) => set({ currentRange: { start, end } }),
  setHoveredEvent: (event) => set({ hoveredEvent: event }),
}));
