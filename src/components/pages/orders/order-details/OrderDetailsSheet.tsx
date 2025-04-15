"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Sheet, SheetContent } from "@/components/shadcn/ui/sheet";
import { useOrderStore } from "@/store/order-store";
import { Check, PhoneOutgoing } from "lucide-react";
import OrderDetailsMap from "./Map";
import DeliveryInfo from "./DeliveryInfo";
import OrderDetails from "./OrderDetails";
import PhoneSheet from "../sheets/PhoneSheet";
import useOrderStatusUpdate from "../order-management/hooks/useOrderStatusUpdate";
import { useState } from "react";

export function OrderDetailSheet() {
  const { selectedOrder, isSheetOpen, closeSheet } = useOrderStore();
  const [isPhoneSheetOpen, setIsPhoneSheetOpen] = useState(false);

  const { updateOrderStatus, isPending } = useOrderStatusUpdate();

  if (!selectedOrder) return null;

  const handleAcceptOrder = () => {
    if (!selectedOrder || !selectedOrder.id) return;
    updateOrderStatus("pending", selectedOrder.id);
  };
  const handleMarkAsReady = () => {
    if (!selectedOrder || !selectedOrder.id) return;
    updateOrderStatus("ready", selectedOrder.id);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent
        side="right"
        className="w-full overflow-hidden p-0 sm:max-w-md [&>button:last-child]:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <OrderDetailsMap closeSheet={closeSheet} />

            <DeliveryInfo />

            <OrderDetails />
          </div>

          {selectedOrder.status === "ready" ? (
            <div className="p-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-md border-2"
                onClick={() => setIsPhoneSheetOpen(true)}
              >
                <PhoneOutgoing className="text-brand-main h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-5 border-t bg-white p-4">
              <Button
                variant="outline"
                size="lg"
                className="w-16 flex-shrink-0 rounded-md border-2"
                onClick={() => setIsPhoneSheetOpen(true)}
              >
                <PhoneOutgoing className="text-brand-main h-5 w-5" />
              </Button>

              {selectedOrder.status === "pending" && (
                <Button
                  size="lg"
                  className="bg-brand-main hover:bg-brand-hover flex-1 rounded-md text-white"
                  onClick={handleAcceptOrder}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="animate-pulse">Accepting...</span>
                  ) : (
                    "Accept"
                  )}
                  <Check className="ml-2 h-5 w-5" />
                </Button>
              )}

              {selectedOrder.status === "accepted" && (
                <Button
                  size="lg"
                  className="bg-brand-main hover:bg-brand-hover flex-1 rounded-md text-white"
                  onClick={handleMarkAsReady}
                >
                  Mark as ready
                </Button>
              )}
            </div>
          )}
        </div>

        {isPhoneSheetOpen && (
          <PhoneSheet
            onClose={() => setIsPhoneSheetOpen(false)}
            phoneNumber={selectedOrder.customerPhone}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
