import React from "react";
import { ScrollArea, ScrollBar } from "@/components/shadcn/ui/scroll-area";
import { Clock, List } from "lucide-react";
import { Progress } from "@/components/shadcn/ui/progress";
import useOrdersData from "./hooks/useOrdersData";
import { parseIsoDate } from "./utils";
import { IOrder } from "@/types/orders";

interface ReadyOrdersProps {
  handleOrderClick: (order: IOrder) => void;
}

const ReadyOrders: React.FC<ReadyOrdersProps> = ({ handleOrderClick }) => {
  const { ordersData } = useOrdersData();
  const readyOrders =
    ordersData?.filter((order) => order.status === "ready") || [];

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-3xl font-bold">Ready</h2>
      <ScrollArea className="flex w-full flex-col py-4 whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {readyOrders.length === 0 && (
            <div className="flex h-32 items-center justify-center text-lg font-medium text-gray-500">
              No orders ready
            </div>
          )}
          {readyOrders.map((order) => {
            const { date } = parseIsoDate(order.created_at);
            return (
              <div
                key={order.id}
                className="flex max-w-[500px] min-w-[400px] flex-col gap-6 rounded-lg bg-gray-50 p-4 shadow-sm"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center rounded-md bg-yellow-400 px-3 py-1 text-sm font-medium text-black">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-medium text-white">
                        Is almost there
                      </span>
                      <Clock className="text-white" height={10} width={10} />
                    </div>
                  </div>
                  <div className="text-dark-3 text-sm">#{order.code}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock
                        className="text-dark-3/70"
                        width={16}
                        height={16}
                      />
                      <div className="text-dark-3 text-sm">{date}</div>
                    </div>

                    <p className="text-2xl font-bold">
                      {/* {order.productCount}  */}
                      -- Product
                    </p>
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
  );
};

export default ReadyOrders;
