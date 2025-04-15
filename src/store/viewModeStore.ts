import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "grid" | "table";

interface ViewModeState {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set) => ({
      viewMode: "grid",
      toggleViewMode: () =>
        set((state) => ({
          viewMode: state.viewMode === "grid" ? "table" : "grid",
        })),
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: "view-mode-storage",
    },
  ),
);
