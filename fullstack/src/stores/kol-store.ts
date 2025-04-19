import { create } from "zustand";

interface KolState {
  selectedKolId: string | null;
  setSelectedKolId: (kolId: string | null) => void;
}

export const useKolStore = create<KolState>((set) => ({
  selectedKolId: null,
  setSelectedKolId: (kolId) => set({ selectedKolId: kolId }),
}));
