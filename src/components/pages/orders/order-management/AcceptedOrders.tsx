import React from "react";
import { ScrollArea, ScrollBar } from "@/components/shadcn/ui/scroll-area";
import { useOrderStore } from "@/store/order-store";
import { CircleCheckBig, Clock, List } from "lucide-react";
import { Progress } from "@/components/shadcn/ui/progress";
import useOrdersData from "./hooks/useOrdersData";
import { parseIsoDate } from "./utils";
import useOrderStatusUpdate from "./hooks/useOrderStatusUpdate";
import { IOrder } from "@/types/orders";

const AcceptedOrders = () => {
  const { setSelectedOrder, openSheet } = useOrderStore();
  const { ordersData } = useOrdersData();
  const acceptedOrders =
    ordersData?.filter((order) => order.status === "accepted") || [];
  const { updateOrderStatus, isPending } = useOrderStatusUpdate();

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrder(order);
    openSheet();
  };

  const handleMarkOrderAsReady = (order: IOrder) => {
    if (!order || !order.id) return;
    updateOrderStatus("ready", order.id);
  };

  return (
    <>
      <section className="mb-10">
        <h2 className="mb-4 text-3xl font-bold">Accepted</h2>
        <ScrollArea className="flex w-full flex-col py-4 whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {acceptedOrders.length === 0 && (
              <div className="flex h-32 items-center justify-center text-lg font-medium text-gray-500">
                No accepted orders
              </div>
            )}
            {acceptedOrders.map((order) => {
              const { date, time } = parseIsoDate(order.created_at);

              return (
                <div
                  key={order.id}
                  className="flex max-w-[500px] min-w-[400px] flex-col gap-6 rounded-lg bg-gray-50 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="bg-brand-accent inline-flex items-center rounded-md px-2 py-1">
                      <span className="mr-1 text-sm font-medium">Total:</span>
                      <span className="text-dark-1 text-xs font-normal">
                        MAD {parseFloat(order.total_price).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-dark-3 text-sm">#{order.code}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-dark-3 text-sm">{date}</div>
                        <div className="text-2xl font-bold">{time}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        className="bg-brand-main hover:bg-brand-hover flex w-full items-center justify-center rounded-md px-4 py-2 text-xs font-medium text-white"
                        onClick={() => handleMarkOrderAsReady(order)}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs leading-6 font-medium">
                            {isPending ? (
                              <span className="animate-pulse">Marking ...</span>
                            ) : (
                              "Mark as ready"
                            )}
                          </span>
                          <CircleCheckBig height={10} width={10} />
                        </div>
                      </button>

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
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Progress
                      value={100}
                      className="h-1 w-28"
                      indicatorColor="bg-brand-main"
                    />
                    <Progress
                      value={66}
                      className="h-1"
                      indicatorColor="bg-brand-main"
                    />
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

export default AcceptedOrders;
