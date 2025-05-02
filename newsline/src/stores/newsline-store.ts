import { TimelineEvent } from "@/types/timeline";
import { UTCTimestamp } from "lightweight-charts";
import { create } from "zustand";

interface NewslineState {
  selectedTokenSymbol: "BTC";
  currentTimeRange: { start: UTCTimestamp; end: UTCTimestamp };
  hoveredEvent: TimelineEvent | null;

  setTimeRange: (start: UTCTimestamp, end: UTCTimestamp) => void;
  setHoveredEvent: (event: TimelineEvent | null) => void;
}

export const useNewslineStore = create<NewslineState>((set) => ({
  selectedTokenSymbol: "BTC",
  currentTimeRange: {
    start: 0 as UTCTimestamp,
    end: 0 as UTCTimestamp,
  },
  hoveredEvent: null,

  setTimeRange: (start, end) => set({ currentTimeRange: { start, end } }),
  setHoveredEvent: (event) => set({ hoveredEvent: event }),
}));
