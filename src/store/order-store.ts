import { IOrder, IOrderArticle } from "@/types/orders";
import { create } from "zustand";

export type OrderStatus = "pending" | "accepted" | "ready";
export type EditSheetType =
  | "none"
  | "editPizza"
  | "editQuantity"
  | "editAttribute"
  | "articles"
  | "productDetail";

// export interface IArticle {
//   id: string;
//   name: string;
//   quantity: number;
//   extras: string[];
//   price: number;
//   image: string;
// }

// export interface Order {
//   id: number;
//   created_at: string;
//   status: string;
//   total_price: string;
//   customer_address: string;
//   user: number;
//   restaurant: number;
//   // total: number;
//   // date: string;
//   // time?: string;
//   productCount?: number;
//   estimatedPrepTime?: number;
//   distance?: number;
//   products?: IArticle[];
//   orderId?: string;
//   orderCode?: string;
//   paymentMethod?: string;
//   storeCity?: string;
//   storeName: string;
//   storeAddress: string;
//   customerName: string;
//   customerPhone: string;
// }

interface OrderStore {
  selectedOrder: IOrder | null;
  isSheetOpen: boolean;
  isCreateOrderSheetOpen: boolean;
  editSheetType: EditSheetType;
  selectedProduct: IOrderArticle | null;
  setSelectedOrder: (order: IOrder | null) => void;
  openSheet: () => void;
  closeSheet: () => void;
  openEditSheet: (type: EditSheetType, product?: IOrderArticle) => void;
  closeEditSheet: () => void;

  setSelectedProduct: (product: IOrderArticle | null) => void;
  // updateProductQuantity: (productId: string, quantity: number) => void;
  // updateProductExtras: (productId: string, extras: string[]) => void;
  // addProduct: (product: IArticle) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  selectedOrder: null,
  isSheetOpen: false,
  isCreateOrderSheetOpen: false,
  editSheetType: "none",
  selectedProduct: null,
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  openEditSheet: (type, product) =>
    set({
      editSheetType: type,
      selectedProduct: product,
    }),
  closeEditSheet: () => set({ editSheetType: "none", selectedProduct: null }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
