import React from "react";
import { Clock, MapPin, Package } from "lucide-react";
import { Progress } from "@/components/shadcn/ui/progress";
import { useOrderStore } from "@/store/order-store";

const DeliveryInfo = () => {
  const { selectedOrder } = useOrderStore();

  if (!selectedOrder) return null;

  return (
    <div className="space-y-4 border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-brand-main h-5 w-5" />
          <div>
            <div className="text-xs text-gray-500">Estimated Prep</div>
            <div className="font-bold">
              {selectedOrder.estimatedPrepTime ?? "--"} min
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-brand-main h-5 w-5" />
          <div>
            <div className="text-xs text-gray-500">Distance</div>
            <div className="font-bold">{selectedOrder.distance ?? "--"} km</div>
          </div>
        </div>
      </div>

      <Progress
        value={
          selectedOrder.status === "pending"
            ? 33
            : selectedOrder.status === "accepted"
              ? 66
              : 90
        }
        className="h-1 bg-gray-100"
        indicatorColor="bg-brand-main"
      />

      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-500" />
        <span className="text-gray-700">Delivered</span>
      </div>

      {selectedOrder.status === "accepted" && (
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">Assigned To --.</span>
          {/* {this need to be in order / dynamic} */}
        </div>
      )}

      {selectedOrder.status === "ready" && (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">On the way</span>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;
