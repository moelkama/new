import { Sheet, SheetContent } from "@/components/shadcn/ui/sheet";
import React, { useState } from "react";
import Image from "next/image";
import { CartItem, useCartStore } from "@/store/orders/order-cart";
import { Button } from "@/components/shadcn/ui/button";
import { FileMinus2 } from "lucide-react";
import { useCustomerStore } from "@/store/orders/createCustomerStore";
import AddonsSheet from "./AddonsSheet";
import { cartItemTotalPrice } from "./utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/hooks/apis/useApi";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { toast } from "sonner";
import AlertModal from "./OrderConfirmAlertModal";

interface CartSheetProps {
  onClose: () => void;
  isOpen: boolean;
}

interface CartItemPayload {
  article: number;
  quantity: number;
  selected_addons: number[];
}
interface OrderCreationPayload {
  customer_address: string;
  user_id: number;
  order_items: CartItemPayload[];
}

const CartSheet: React.FC<CartSheetProps> = ({ onClose, isOpen }) => {
  const customerData = useCustomerStore((state) => state.customer);
  const removeCustomerFromLocalStorage = useCustomerStore(
    (state) => state.removeCustomerFromLocalStorage,
  );
  const cartItems = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearLocalStorage = useCartStore((state) => state.clearLocalStorage);
  const clearCart = useCartStore((state) => state.clearCart);

  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [isOrderConfirmAlertModalOpen, setIsOrderConfirmAlertModalOpen] =
    useState(false);
  const [isAddonsSheetOpen, setIsAddonsSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const { fetchWithAuth } = useApi();

  const { mutate: createOrderMutation, isPending } = useMutation({
    mutationFn: async (payload: OrderCreationPayload) => {
      const response = await fetchWithAuth(`${API_ENDPOINTS.createOrder}/`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Order created successfully!");
      setIsOrderConfirmAlertModalOpen(true);
      clearCart();
      clearLocalStorage();
      removeCustomerFromLocalStorage();
      setTimeout(() => {
        onClose();
      }, 2500);
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Error creating order. Please try again.");
    },
  });

  const handleConfirmOrder = () => {
    if (!customerData.customer_id) {
      toast.error("Please add or select a customer first.");
      return;
    }

    const orderItems: CartItemPayload[] = cartItems.map((item) => {
      return {
        article: item.id,
        quantity: item.quantity || 1,
        selected_addons: item.addons?.map((addon) => addon.id) || [],
      };
    });
    const payload: OrderCreationPayload = {
      customer_address: customerData.customer_address,
      user_id: customerData.customer_id,
      order_items: orderItems,
    };
    createOrderMutation(payload);
  };

  return (
    <>
      <AlertModal
        isOpen={isOrderConfirmAlertModalOpen}
        onClose={() => setIsOrderConfirmAlertModalOpen(false)}
        description="New Order was confirmed"
      />
      {isAddonsSheetOpen && selectedItem && (
        <AddonsSheet
          onClose={() => setIsAddonsSheetOpen(false)}
          isOpen={isAddonsSheetOpen}
          item={selectedItem}
        />
      )}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h1 className="text-dark-1 text-2xl font-bold">Cart items</h1>

              <div className="border-b py-4">
                <div className="flex gap-2">
                  <FileMinus2 className="text-brand-main" />
                  <div className="flex flex-col gap-1">
                    <span className="text-dark-1 font-bold">Order detail</span>
                    <span className="text-dark-3">
                      {cartItems.length} products
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 py-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex justify-between gap-4"
                  >
                    <div className="relative h-20 w-20">
                      <Image
                        src={"/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>

                    <p className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                      {item.quantity}x
                    </p>

                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <div>
                        {item?.addons?.map((addon, index) => (
                          <div key={index} className="text-dark-3 text-sm">
                            {item.quantity} {addon.name}
                          </div>
                        ))}
                      </div>

                      <p className="text-dark-3">
                        {cartItemTotalPrice(item).toFixed(2)} MAD
                      </p>

                      <div className="absolute right-0 bottom-0 mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 rounded-md"
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity ?? 1) - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="bg-brand-main flex h-7 w-7 items-center justify-center rounded-md text-white">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 rounded-md"
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity ?? 1) + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="text-brand-main"
                      onClick={() => {
                        setIsAddonsSheetOpen(true);
                        setSelectedItem(item);
                        console.log("Selected item:", item);
                      }}
                    >
                      ADD ONS
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t py-4">
                <div className="flex items-center gap-2">
                  <FileMinus2 className="text-brand-main" />
                  <span className="text-dark-1 font-bold">Total price</span>
                  <span className="ml-auto font-medium">{totalPrice} MAD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 border-t bg-white p-4">
            <Button
              className="bg-brand-main w-full cursor-pointer text-white"
              size="lg"
              onClick={handleConfirmOrder}
            >
              {isPending
                ? "Create Order ..."
                : `Confirm Order (MAD ${totalPrice.toFixed(2)})`}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
