import { Button } from "@/components/shadcn/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/ui/sheet";
import { useApi } from "@/hooks/apis/useApi";
import { IOrderArticle } from "@/types/orders";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface EditSheetProps {
  product: IOrderArticle | null;
  onClose: () => void;
  orderId: number;
}

interface EditQuantityPayload {
  order_items: {
    article: number;
    quantity: number;
  }[];
}

const EditQuantitySheet: React.FC<EditSheetProps> = ({
  onClose,
  product,
  orderId,
}) => {
  const [quantity, setQuantity] = useState(product?.quantity || 1);
  const { fetchWithAuth } = useApi();
  const { mutate: updateQuantityMutation, isPending } = useMutation({
    mutationFn: async (data: EditQuantityPayload) => {
      const response = await fetchWithAuth(`/order/${orderId}/update/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Quantity updated successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update quantity.");
    },
  });

  const handleUpdateQuantity = () => {
    if (!product) return;
    const payload = {
      order_items: [
        {
          article: product.id,
          quantity: quantity,
        },
      ],
    };

    updateQuantityMutation(payload);
  };

  return (
    <Sheet open onOpenChange={() => onClose()}>
      <SheetContent
        side="right"
        className="top-auto h-52 w-full translate-y-0 p-0 sm:max-w-md"
        style={{
          top: "auto",
          bottom: 0,
          transform: "translateX(0)",
        }}
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="flex-row items-center justify-between border-b p-4">
            <SheetTitle>Edit quantity</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-xl font-medium">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="border-t p-4">
            <Button
              className="hover:bg-brand-main w-full bg-teal-500"
              onClick={handleUpdateQuantity}
            >
              {isPending ? (
                <span className="animate-pulse">Updating...</span>
              ) : (
                <span>Accept</span>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditQuantitySheet;
