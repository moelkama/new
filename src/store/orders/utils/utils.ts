import { CartItem } from "../order-cart";

export const calculateTotalItems = (items: CartItem[]) => {
  return items.reduce((total, item) => total + (item.quantity ?? 0), 0);
};

export const calculateTotalPrice = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    let itemTotal = item.price * (item.quantity ?? 1);

    if (item.addons && item.addons.length > 0) {
      const addonTotal = item.addons.reduce(
        (sum, addon) => sum + addon.price * (item.quantity ?? 1),
        0,
      );

      itemTotal += addonTotal;
    }

    return total + itemTotal;
  }, 0);
};
