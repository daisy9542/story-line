import { create } from "zustand";

import { TokenSymbol } from "@/types/token-symbol";

interface KolState {
  selectedTokenSymbol: TokenSymbol;
  selectedKolId: string | null;
  leftCardsOpen: boolean;
  candlestickChartOpen: boolean;

  setSelectedKolId: (kolId: string | null) => void;
  setSelectedTokenSymbol: (token: TokenSymbol) => void;
  setLeftCardsOpen: (open: boolean) => void;
  setCandlestickChartOpen: (open: boolean) => void;
}

export const useKolStore = create<KolState>()((set) => ({
  selectedTokenSymbol: "BTC",
  selectedKolId: null,
  leftCardsOpen: true,
  candlestickChartOpen: false,

  setSelectedKolId: (kolId) => set({ selectedKolId: kolId }),
  setSelectedTokenSymbol: (token) => set({ selectedTokenSymbol: token }),
  setLeftCardsOpen: (open) => set({ leftCardsOpen: open }),
  setCandlestickChartOpen: (open) => set({ candlestickChartOpen: open }),
}));
