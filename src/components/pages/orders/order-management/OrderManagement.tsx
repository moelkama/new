"use client";

import { OrderDetailSheet } from "@/components/pages/orders/order-details/OrderDetailsSheet";
import { useOrderStore } from "@/store/order-store";
import { useRouter, useSearchParams } from "next/navigation";
import PendingOrders from "./PendingOrders";
import AcceptedOrders from "./AcceptedOrders";
import ReadyOrders from "./ReadyOrders";
import { IOrder } from "@/types/orders";

export default function OrderManagement() {
  const { setSelectedOrder, openSheet } = useOrderStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrder(order);
    openSheet();
  };

  const handleNewOrderCreation = () => {
    const params = new URLSearchParams(searchParams);
    params.set("isNewOrder", "true");
    params.set("isNewOrderModalOpen", "true");
    router.push(`/orders?${params.toString()}`);
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <PendingOrders handleOrderClick={handleOrderClick} />
        <AcceptedOrders />
        <ReadyOrders handleOrderClick={handleOrderClick} />

        <div className="flex justify-center">
          <button
            onClick={handleNewOrderCreation}
            className="bg-brand-main w-full max-w-md rounded-md px-6 py-3 text-lg font-medium text-white"
          >
            New Order
          </button>
        </div>
      </div>

      <OrderDetailSheet />
    </>
  );
}
