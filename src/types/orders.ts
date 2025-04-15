export type IAddon = {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  price: number;
};

export type IArticle = {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  price: number;
  section: number;
  is_available: boolean;
  available_addons: IAddon[];
  order: number;
  tags?: string[];
  rating?: number;
  calories?: number;
  category?: string;
  stock?: number;
  quantity?: number;
  addons?: IAddon[];
};

export type ISection = {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  menu: number;
  start_price: number | null;
  order: number;
  results: IArticle[];
  count?: number;
};

export type ISectionDetails = {
  results: IArticle[];
  count: number;
  current_page: number;
  total_pages: number;
  is_paginated: boolean;
  has_next: boolean;
  has_previous: boolean;
};

export interface IOrderResponse {
  id: number;
  created_at: string;
  status: string;
  total_price: string;
  customer_address: string;
  user: number;
  restaurant: number;
  code: string;
  restaurant_name: string;
  user_email: string;
}

export interface IOrderArticle {
  id: number;
  article: number;
  article_name: string;
  article_price: string;
  article_image: string | null;
  article_description: string | null;
  quantity: number;
  selected_addons: IAddon[];
  selected_addons_details: IAddon[];
  total_price: number;
}

export interface IOrder extends IOrderResponse {
  productCount?: number;
  estimatedPrepTime?: number;
  distance?: number;
  order_items?: IOrderArticle[];
  orderId?: string;
  orderCode?: string;
  paymentMethod?: string;
  storeCity?: string;
  storeName?: string;
  storeAddress?: string;
  customerName?: string;
  customerPhone?: string;
  addons?: IAddon[];
}

// export interface IOrder {
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
//   items?: IArticle[];
//   orderId?: string;
//   orderCode?: string;
//   paymentMethod?: string;
//   storeCity?: string;
//   storeName?: string;
//   storeAddress?: string;
//   customerName?: string;
//   customerPhone?: string;
//   addons?: IAddon[];
// }
