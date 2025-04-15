import { Button } from "@/components/shadcn/ui/button";
import { Sheet, SheetContent } from "@/components/shadcn/ui/sheet";
import { Minus, Plus, X } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/shadcn/ui/label";
import { Switch } from "@/components/shadcn/ui/switch";
import { IOrderArticle } from "@/types/orders";
import useAddonsData from "../../create-order/hooks/useAddonsData";
import { useReplaceOrderStore } from "@/store/orders/replaceOrderStore";

interface EditSheetProps {
  onClose: () => void;
  product: IOrderArticle | null;
}

const AddAddonsSheet: React.FC<EditSheetProps> = ({ product, onClose }) => {
  const { addonsData, isLoading } = useAddonsData();
  const [quantity, setQuantity] = useState<number>(1);
  const { updateItemQuantity } = useReplaceOrderStore();

  if (!product) return null;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // TODO: add logic to calculate sleected addons and their prices then multiply by quantity

  return (
    <Sheet open>
      <SheetContent
        side="right"
        className="w-full overflow-hidden p-0 sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <div className="relative h-[200px] bg-gray-100">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full bg-white shadow-md"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Boca Chicken"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div>
              <h2 className="text-2xl font-bold">Boca Chicken</h2>
              <p className="text-gray-600">{product?.article_description}</p>
            </div>

            <div>
              <h3 className="mb-2 font-bold uppercase">ADD ONS</h3>
              {addonsData?.map((addon) => (
                <div className="mb-2 space-y-4" key={addon.id}>
                  <div className="rounded-md border p-4">
                    <h4 className="mb-2 font-medium">{addon.name}</h4>
                    {addon.addons.map((subAddon) => (
                      <div className="space-y-3" key={subAddon.id}>
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                            <Switch />
                            <Label>{subAddon.name}</Label>
                          </div>

                          <span>{subAddon.price} MAD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-xl font-medium">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="hover:bg-brand-main bg-teal-500"
              onClick={() => {
                updateItemQuantity(product.id, quantity);
                onClose();
              }}
            >
              Add <span className="ml-1">(price to be added) MAD</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddAddonsSheet;
