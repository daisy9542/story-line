import { create } from "zustand";

import { TokenSymbol } from "@/types/graph";
import { SimpleKOL } from "@/types/kol";

interface KolState {
  selectedTokenSymbol: TokenSymbol;
  selectedKol: SimpleKOL | null;
  leftCardsOpen: boolean;
  candlestickChartOpen: boolean;

  setSelectedKol: (kol: SimpleKOL | null) => void;
  setSelectedTokenSymbol: (token: TokenSymbol) => void;
  setLeftCardsOpen: (open: boolean) => void;
  setCandlestickChartOpen: (open: boolean) => void;
}

export const useKolStore = create<KolState>()((set) => ({
  selectedTokenSymbol: "BTC",
  selectedKol: null,
  leftCardsOpen: true,
  candlestickChartOpen: false,

  setSelectedKol: (kol) => set({ selectedKol: kol }),
  setSelectedTokenSymbol: (token) => set({ selectedTokenSymbol: token }),
  setLeftCardsOpen: (open) => set({ leftCardsOpen: open }),
  setCandlestickChartOpen: (open) => set({ candlestickChartOpen: open }),
}));
