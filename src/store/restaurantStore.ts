import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RestaurantState {
  selectedRestaurantId: number | null;
  setSelectedRestaurantId: (id: number | null | undefined) => void;
}

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set) => ({
      selectedRestaurantId: null,
      setSelectedRestaurantId: (id) =>
        set({ selectedRestaurantId: id ?? null }),
    }),
    {
      name: "restaurant-storage",
    },
  ),
);
