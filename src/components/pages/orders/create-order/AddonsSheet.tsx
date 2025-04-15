import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/ui/sheet";
import { Button } from "@/components/shadcn/ui/button";
import { Switch } from "@/components/shadcn/ui/switch";
import { Label } from "@/components/shadcn/ui/label";
import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { CartAddon, CartItem, useCartStore } from "@/store/orders/order-cart";
import Image from "next/image";
import { calculateTotalPrice } from "./utils/utils";
import useAddonsData from "./hooks/useAddonsData";

interface AddonsSheetProps {
  onClose: () => void;
  isOpen: boolean;
  item: CartItem;
}

export interface AddonOption {
  id: number;
  name: string;
  price: string;
  is_mandatory: boolean;
  restaurant: number;
}

export interface AddonGroup {
  id: number;
  name: string;
  description: string;
  addons: AddonOption[];
  min_select: number;
  max_select: number;
}

const AddonsSheet: React.FC<AddonsSheetProps> = ({ onClose, isOpen, item }) => {
  const { addAddon, updateQuantity, items } = useCartStore();
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const [selectedAddons, setSelectedAddons] = useState<
    Record<string, CartAddon>
  >(() => {
    const existingAddons: Record<string, CartAddon> = {};
    if (item.addons) {
      item.addons.forEach((addon) => {
        const key = `${addon.group_id || 0}-${addon.id}`;
        existingAddons[key] = { ...addon };
      });
    }
    return existingAddons;
  });

  useEffect(() => {
    const currentItem = items.find((cartItem) => cartItem.id === item.id);
    if (currentItem) {
      setQuantity(currentItem.quantity || 0);
    } else {
      setQuantity(item.quantity || 0);
    }
  }, [items, item.id, item.quantity]);

  const { addonsData } = useAddonsData();

  const handleSwitchChange = (
    option: AddonOption,
    groupId: number,
    checked: boolean,
  ) => {
    const group = addonsData?.find((g) => g.id === groupId);
    if (group) {
      const selectedCount = Object.values(selectedAddons).filter(
        (addon) => addon.group_id === groupId,
      ).length;

      if (checked && selectedCount >= group.max_select) {
        return;
      }
    }
    const updatedAddons = { ...selectedAddons };
    const addonKey = `${groupId}-${option.id}`;

    if (checked) {
      updatedAddons[addonKey] = {
        id: option.id,
        name: option.name,
        price: parseFloat(option.price),
        type: "addon",
        group_id: groupId,
      };
    } else {
      delete updatedAddons[addonKey];
    }

    setSelectedAddons(updatedAddons);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      return;
    }

    Object.values(selectedAddons).forEach((addon) => {
      const existingAddon = item.addons?.find(
        (a) => a.id === addon.id && a.group_id === addon.group_id,
      );

      if (!existingAddon) {
        addAddon(item.id, addon);
      }
    });

    onClose();
  };

  const isAddButtonDisabled = quantity === 0;

  const isAddonSelected = (groupId: number, addonId: number) => {
    const key = `${groupId}-${addonId}`;
    return !!selectedAddons[key];
  };

  const currentItem = {
    ...item,
    quantity: quantity,
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <div className="flex-1 overflow-y-auto">
          <div className="relative h-52 w-full">
            <Image
              src={item.image || "/placeholder.svg?height=100&width=100"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="border-b p-4">
            <SheetHeader>
              <SheetTitle>{item.name}</SheetTitle>
            </SheetHeader>
            <p className="mt-2 text-sm text-gray-500">{item.description}</p>
          </div>

          <div className="p-4">
            <h3 className="mb-4 text-sm font-medium">Add ons</h3>

            {addonsData?.map((group) => (
              <div key={group.id} className="mb-4 rounded-lg bg-teal-50 p-4">
                <h4 className="text-brand-main mb-3 text-sm font-medium">
                  {group.name}
                </h4>

                <div className="space-y-3">
                  {group.addons.map((option) => (
                    <div key={option.id} className="flex items-center gap-4">
                      <Switch
                        id={`${group.id}-${option.id}`}
                        checked={isAddonSelected(group.id, option.id)}
                        onCheckedChange={(checked) =>
                          handleSwitchChange(option, group.id, checked)
                        }
                      />
                      <Label htmlFor={`${group.id}-${option.id}`}>
                        {option.name}
                      </Label>

                      <div className="flex items-center gap-2">
                        <div className="bg-dark-3 h-4 w-[1px]" />
                        MAD
                        <span className="text-sm">{option.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDecreaseQuantity}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-lg font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleIncreaseQuantity}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              className="cursor-pointer bg-teal-500 text-white hover:bg-teal-600"
              onClick={handleAddToCart}
              disabled={isAddButtonDisabled}
            >
              Add ({calculateTotalPrice(currentItem, selectedAddons).toFixed(2)}{" "}
              MAD)
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddonsSheet;
