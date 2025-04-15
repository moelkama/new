import { CartAddon, CartItem } from "@/store/orders/order-cart";

// Calculate total price including addons
export const calculateTotalPrice = (
  item: CartItem,
  selectedAddons: Record<string, CartAddon>,
) => {
  const basePrice = item.price * (item.quantity ?? 1);
  const addonsPrice = Object.values(selectedAddons).reduce(
    (sum, addon) => sum + addon.price * (item.quantity ?? 1),
    0,
  );
  return basePrice + addonsPrice;
};

// Cart item total price calculation

export const cartItemTotalPrice = (item: CartItem) => {
  let itemTotalPrice = item.price * (item.quantity ?? 1);

  if (item.addons && item.addons.length > 0) {
    item.addons.map((addon) => {
      itemTotalPrice += addon.price * (item.quantity ?? 1);
    });
  }
  return itemTotalPrice;
};
