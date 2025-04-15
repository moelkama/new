import { create } from "zustand";

type searchState = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetQuery: () => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
};

const useSearchStore = create<searchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  resetQuery: () => set({ searchQuery: "" }),
  isSearching: false,
  setIsSearching: (isSearching: boolean) => set({ isSearching }),
}));

export default useSearchStore;
