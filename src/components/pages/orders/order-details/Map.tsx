import React from "react";
import { Button } from "@/components/shadcn/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface MapProps {
  closeSheet: () => void;
}

const OrderDetailsMap: React.FC<MapProps> = ({ closeSheet }) => {
  return (
    <div className="relative h-[250px] bg-gray-100">
      <div className="absolute top-2 left-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white shadow-md"
          onClick={closeSheet}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Image
        src="/placeholder.svg?height=600&width=600"
        alt="Map"
        fill
        className="object-cover"
      />
    </div>
  );
};

export default OrderDetailsMap;
