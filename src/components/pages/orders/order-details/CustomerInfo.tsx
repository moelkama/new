import { useOrderStore } from "@/store/order-store";
import { ChevronDown, Package } from "lucide-react";
import React from "react";

const CustomerInfo = () => {
  const { selectedOrder } = useOrderStore();

  if (!selectedOrder) return null;

  return (
    <>
      <div className="rounded-md bg-gray-50 p-3">
        <button className="flex w-full items-center justify-between">
          <span className="text-brand-main font-medium">
            customer contact details
          </span>
          <ChevronDown className="text-brand-main h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
        <div className="flex items-center gap-2">
          <div className="rounded bg-teal-100 p-1">
            <Package className="text-brand-main h-4 w-4" />
          </div>
          <span className="font-medium">phone</span>
        </div>
        <span className="text-gray-600">
          {selectedOrder.customerPhone ?? "--"}
        </span>
      </div>
    </>
  );
};

export default CustomerInfo;
