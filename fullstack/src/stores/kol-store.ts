import { create } from "zustand";

interface KolState {
  selectedKolId: number | null;
  setSelectedKolId: (kolId: number | null) => void;
}

export const useKolStore = create<KolState>((set) => ({
  selectedKolId: null,
  setSelectedKolId: (kolId) => set({ selectedKolId: kolId }),
}));
