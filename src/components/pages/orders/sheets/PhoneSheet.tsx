import { Button } from "@/components/shadcn/ui/button";
import { Sheet, SheetContent } from "@/components/shadcn/ui/sheet";
import { PhoneOutgoing } from "lucide-react";
import React from "react";

interface PhoneSheetProps {
  onClose: () => void;
  phoneNumber: string | null | undefined;
}

const PhoneSheet: React.FC<PhoneSheetProps> = ({ onClose, phoneNumber }) => {
  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="top-auto h-52 w-full translate-y-0 p-0 sm:max-w-md"
        style={{
          top: "auto",
          bottom: 0,
          transform: "translateX(0)",
        }}
      >
        <div className="flex flex-col gap-4 p-4">
          <h2 className="text-lg font-semibold">Customer number</h2>

          <Button
            className="flex items-center gap-2"
            // onClick={() => {
            //   window.location.href = `tel:${phoneNumber}`;
            //   onClose();
            // }}
          >
            <PhoneOutgoing className="h-5 w-5" />
            <span className="text-brand-main font-semibold">
              {phoneNumber ?? "--"}
            </span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PhoneSheet;
