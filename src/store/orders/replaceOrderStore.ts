import { create } from "zustand";

interface OrderItem {
  article: number;
  quantity: number;
  selected_addons: number[];
}

interface ReplaceOrderState {
  orderItems: OrderItem[];
  // Actions
  addItem: (articleId: number) => void;
  updateItemAddons: (articleId: number, addons: number[]) => void;
  updateItemQuantity: (articleId: number, quantity: number) => void;
  removeItem: (articleId: number) => void;
  clearItems: () => void;
  getItem: (articleId: number) => OrderItem | undefined;
}

export const useReplaceOrderStore = create<ReplaceOrderState>((set, get) => ({
  orderItems: [],

  addItem: (articleId) =>
    set((state) => ({
      orderItems: [
        ...state.orderItems,
        { article: articleId, quantity: 1, selected_addons: [] },
      ],
    })),

  updateItemAddons: (articleId, addons) =>
    set((state) => ({
      orderItems: state.orderItems.map((item) =>
        item.article === articleId
          ? { ...item, selected_addons: addons }
          : item,
      ),
    })),

  updateItemQuantity: (articleId, quantity) =>
    set((state) => ({
      orderItems: state.orderItems.map((item) =>
        item.article === articleId ? { ...item, quantity } : item,
      ),
    })),

  removeItem: (articleId) =>
    set((state) => ({
      orderItems: state.orderItems.filter((item) => item.article !== articleId),
    })),

  clearItems: () => set({ orderItems: [] }),

  getItem: (articleId) =>
    get().orderItems.find((item) => item.article === articleId),
}));
