import { STORE_KEYS } from "@/constants/store_keys";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateTotalItems, calculateTotalPrice } from "./utils/utils";
import { IAddon } from "@/types/orders";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  image: string | null;
  currency?: string;
  available_addons?: IAddon[];
  addons?: CartAddon[];
  description: string;
};

export type CartAddon = {
  id: number;
  name: string;
  price: number;
  type?: string;
  group_id?: number;
};

type CartStore = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;

  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;

  addAddon: (id: number, addon: CartAddon) => void;
  removeAddon: (id: number, addonId: number, groupId?: number) => void;
  clearLocalStorage: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          return set((state) => {
            const updatedItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
                : i,
            );

            return {
              items: updatedItems,
              totalItems: calculateTotalItems(updatedItems),
              totalPrice: calculateTotalPrice(updatedItems),
            };
          });
        }

        set((state) => {
          const updatedItems = [
            ...state.items,
            { ...item, quantity: item.quantity || 1 },
          ];
          return {
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            totalPrice: calculateTotalPrice(updatedItems),
            itemsCount: updatedItems.length,
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return {
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            totalPrice: calculateTotalPrice(updatedItems),
            itemsCount: updatedItems.length,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(id);
        }

        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );

          return {
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            totalPrice: calculateTotalPrice(updatedItems),
            itemsCount: updatedItems.length,
          };
        });
      },

      addAddon: (id: number, addon: CartAddon) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id !== id) return item;

            const existingAddonIndex = item.addons?.findIndex(
              (a) => a.id === addon.id && a.group_id === addon.group_id,
            );

            if (
              existingAddonIndex !== undefined &&
              existingAddonIndex >= 0 &&
              item.addons
            ) {
              const newAddons = [...item.addons];
              newAddons[existingAddonIndex] = addon;
              return {
                ...item,
                addons: newAddons,
              };
            } else {
              return {
                ...item,
                addons: [...(item.addons || []), addon],
              };
            }
          });

          return {
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            totalPrice: calculateTotalPrice(updatedItems),
            itemsCount: updatedItems.length,
          };
        });
      },

      removeAddon: (id: number, addonId: number, groupId?: number) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id !== id) return item;

            return {
              ...item,
              addons: item.addons?.filter(
                (addon) =>
                  !(
                    addon.id === addonId &&
                    (groupId === undefined || addon.group_id === groupId)
                  ),
              ),
            };
          });

          return {
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems),
            totalPrice: calculateTotalPrice(updatedItems),
            itemsCount: updatedItems.length,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      clearLocalStorage: () => {
        localStorage.removeItem(STORE_KEYS.ORDER_CART);
      },
    }),
    {
      name: STORE_KEYS.ORDER_CART,
    },
  ),
);
