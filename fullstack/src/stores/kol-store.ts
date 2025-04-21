import { create } from "zustand";

import { TokenSymbol } from "@/types/graph";
import { SimpleKOL } from "@/types/kol";

interface KolState {
  selectedTokenSymbol: TokenSymbol;
  selectedKol: SimpleKOL | null;
  targetKol: SimpleKOL | null;
  filterFollowers: number;
  filterTime: number;
  filterChanged: boolean;
  leftCardsOpen: boolean;
  candlestickChartOpen: boolean;

  setSelectedTokenSymbol: (token: TokenSymbol) => void;
  setSelectedKol: (kol: SimpleKOL | null) => void;
  setTargetKol: (kol: SimpleKOL | null) => void;
  setFilterFollowers: (followers: number) => void;
  setFilterTime: (time: number) => void;
  setFilterChanged: (changed: boolean) => void;
  setLeftCardsOpen: (open: boolean) => void;
  setCandlestickChartOpen: (open: boolean) => void;
}

export const useKolStore = create<KolState>()((set) => ({
  selectedTokenSymbol: "BTC",
  selectedKol: null,
  targetKol: null,
  filterFollowers: 1000,
  filterTime: Date.now(),
  filterChanged: false,
  leftCardsOpen: true,
  candlestickChartOpen: false,

  setSelectedTokenSymbol: (token) => set({ selectedTokenSymbol: token }),
  setSelectedKol: (kol) => set({ selectedKol: kol }),
  setTargetKol: (kol) => set({ targetKol: kol }),
  setFilterFollowers: (followers) => set({ filterFollowers: followers }),
  setFilterTime: (time) => set({ filterTime: time }),
  setFilterChanged: (changed) => set({ filterChanged: changed }),
  setLeftCardsOpen: (open) => set({ leftCardsOpen: open }),
  setCandlestickChartOpen: (open) => set({ candlestickChartOpen: open }),
}));
