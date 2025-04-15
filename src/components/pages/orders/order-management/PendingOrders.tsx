import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/shadcn/ui/scroll-area";
import { Check, Clock, List, X } from "lucide-react";
import CustomAlert from "../../../shared/CustomAlert";
import CustomConfirmModal from "@/components/shared/CustomConfirmModal";
import useOrdersData from "./hooks/useOrdersData";
import { parseIsoDate } from "./utils";
import useOrderStatusUpdate from "./hooks/useOrderStatusUpdate";
import { IOrder } from "@/types/orders";

interface PendingOrdersProps {
  handleOrderClick: (order: IOrder) => void;
}

const PendingOrders: React.FC<PendingOrdersProps> = ({ handleOrderClick }) => {
  const { ordersData, isError, isLoading } = useOrdersData();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAcceptConfirmOpen, setIsAcceptConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const pendingOrders =
    ordersData?.filter((order) => order.status === "pending") || [];

  const { updateOrderStatus, isPending } = useOrderStatusUpdate();

  const handleOrderDecline = () => {
    if (!selectedOrder || !selectedOrder.id) return;
    updateOrderStatus("decline", selectedOrder.id);
    setIsAlertOpen(false);
  };

  const handleAcceptOrder = () => {
    if (!selectedOrder || !selectedOrder.id) return;
    updateOrderStatus("accepted", selectedOrder.id);
    setIsAcceptConfirmOpen(false);
  };

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Error loading orders please try again later</p>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="flex h-screen items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      )}
      {isAlertOpen && (
        <CustomAlert
          onConfirm={handleOrderDecline}
          description="Are you sure you want to decline this order? This action is irreversible."
        />
      )}

      {isAcceptConfirmOpen && (
        <CustomConfirmModal
          onConfirm={handleAcceptOrder}
          description="Are you sure you want to accept this order?"
        />
      )}
      <section className="mb-10">
        <h2 className="mb-4 text-3xl font-bold">Pending</h2>
        {pendingOrders.length === 0 && (
          <div className="flex h-32 items-center justify-center text-lg font-medium text-gray-500">
            No pending orders
          </div>
        )}
        <ScrollArea className="flex w-full flex-col py-4 whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {pendingOrders.map((order) => {
              const { date, time } = parseIsoDate(order.created_at);
              return (
                <div
                  key={order.id}
                  className="max-w-[500px] min-w-[400px] rounded-lg bg-gray-50 p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="bg-brand-accent inline-flex items-center rounded-md px-2 py-1">
                      <span className="mr-1 text-sm font-medium">Total:</span>
                      <span className="text-dark-1 text-xs font-normal">
                        MAD {parseFloat(order.total_price).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-dark-3 text-sm">#{order.code}</div>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-dark-3 text-sm">{date}</div>
                        <div className="text-2xl font-bold">{time}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="text-brand-main inline-flex cursor-pointer items-center text-sm font-medium"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs leading-6 font-medium">
                          View Details
                        </span>
                        <List height={8} width={8} />
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      className="bg-brand-main hover:bg-brand-hover flex flex-1 items-center justify-center rounded-md px-4 py-2 text-xs font-medium text-white"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsAcceptConfirmOpen(true);
                      }}
                    >
                      <div className="flex gap-1">
                        {isPending ? (
                          <span className="animate-pulse">Accepting ...</span>
                        ) : (
                          <span>Accept</span>
                        )}
                        <Check className="h-4 w-4" />
                      </div>
                    </button>
                    <button
                      className="flex flex-1 items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-xs font-medium text-black hover:bg-yellow-500"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsAlertOpen(true);
                      }}
                    >
                      <div className="flex gap-1">
                        {isPending ? (
                          <span className="animate-pulse">Declining ...</span>
                        ) : (
                          <span>Decline</span>
                        )}
                        <X className="h-4 w-4" />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </>
  );
};

export default PendingOrders;
