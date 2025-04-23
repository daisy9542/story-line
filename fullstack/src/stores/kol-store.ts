import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { TokenSymbol } from "@/types/graph";
import { SimpleKOL } from "@/types/kol";

interface KolState {
  hydrated: boolean;
  setHydrated: (h: boolean) => void;

  needRefresh: boolean;
  selectedTokenSymbol: TokenSymbol;
  selectedKol: SimpleKOL | null;
  targetKol: SimpleKOL | null;
  filterFollowers: number;
  filterTime: number;
  filterChanged: boolean;
  leftCardsOpen: boolean;
  candlestickChartOpen: boolean;

  // 用户关注或屏蔽的 KOL ID
  interestedKolIds: string[];
  excludedKolIds: string[];

  // Setters
  setNeedRefresh: (needRefresh: boolean) => void;
  setSelectedTokenSymbol: (token: TokenSymbol) => void;
  setSelectedKol: (kol: SimpleKOL | null) => void;
  setTargetKol: (kol: SimpleKOL | null) => void;
  setFilterFollowers: (followers: number) => void;
  setFilterTime: (time: number) => void;
  setFilterChanged: (changed: boolean) => void;
  setLeftCardsOpen: (open: boolean) => void;
  setCandlestickChartOpen: (open: boolean) => void;

  addInterestedKolId: (kolId: string) => void;
  removeInterestedKolId: (kolId: string) => void;
  addExcludedKolId: (kolId: string) => void;
  removeExcludedKolId: (kolId: string) => void;
}

export const useKolStore = create<KolState>()(
  persist(
    (set) => ({
      hydrated: false,
      setHydrated: (h: boolean) => set({ hydrated: h }),
      needRefresh: false,
      selectedTokenSymbol: "BTC",
      selectedKol: null,
      targetKol: null,
      filterFollowers: 1000,
      // filterTime: Date.now(),
      filterTime: 1743544033000, // 离线数据最大时间戳
      filterChanged: false,
      leftCardsOpen: true,
      candlestickChartOpen: false,

      interestedKolIds: [],
      excludedKolIds: [],

      setNeedRefresh: (needRefresh: boolean) =>
        set({ needRefresh: needRefresh }),
      setSelectedTokenSymbol: (token) => set({ selectedTokenSymbol: token }),
      setSelectedKol: (kol) => set({ selectedKol: kol }),
      setTargetKol: (kol) => set({ targetKol: kol }),
      setFilterFollowers: (followers) => set({ filterFollowers: followers }),
      setFilterTime: (time) => set({ filterTime: time }),
      setFilterChanged: (changed) => set({ filterChanged: changed }),
      setLeftCardsOpen: (open) => set({ leftCardsOpen: open }),
      setCandlestickChartOpen: (open) => set({ candlestickChartOpen: open }),

      addInterestedKolId: (kolId) =>
        set((state) => ({
          interestedKolIds: state.interestedKolIds.includes(kolId)
            ? state.interestedKolIds
            : [...state.interestedKolIds, kolId],
          excludedKolIds: state.excludedKolIds.filter((id) => id !== kolId),
        })),
      removeInterestedKolId: (kolId) =>
        set((state) => ({
          interestedKolIds: state.interestedKolIds.filter((id) => id !== kolId),
        })),
      addExcludedKolId: (kolId) =>
        set((state) => ({
          excludedKolIds: state.excludedKolIds.includes(kolId)
            ? state.excludedKolIds
            : [...state.excludedKolIds, kolId],
          interestedKolIds: state.interestedKolIds.filter((id) => id !== kolId),
        })),
      removeExcludedKolId: (kolId) =>
        set((state) => ({
          excludedKolIds: state.excludedKolIds.filter((id) => id !== kolId),
        })),
    }),
    {
      name: "kol-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        interestedKolIds: state.interestedKolIds,
        excludedKolIds: state.excludedKolIds,
      }),
      onRehydrateStorage: (api) => () => {
        api.setHydrated(true);
      },
    },
  ),
);
