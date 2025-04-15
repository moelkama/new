import { Button } from "@/components/shadcn/ui/button";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { Label } from "@/components/shadcn/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/ui/sheet";
import { ChevronDown, ChevronUp } from "lucide-react";
import useAddonsData from "../../create-order/hooks/useAddonsData";
import { useState } from "react";
import { IOrderArticle } from "@/types/orders";

interface EditSheetProps {
  onClose: () => void;
  product: IOrderArticle | null;
  orderId: number;
}

// TODO: addonsData need transform in bakend, (now each addon can have same ids in different groups)
// the backend require [1, 2] wich is not correct, it should be [{id: 1, collectionId: 1}, {id: 2, collectionId: 1}]

const EditAddonsSheet: React.FC<EditSheetProps> = ({
  onClose,
  product,
  // orderId,
}) => {
  console.log("product", product);
  const { addonsData, isLoading } = useAddonsData();
  const [selectedAddons, setSelectedAddons] = useState<number[]>(
    product?.selected_addons_details?.map((addon) => addon.id) || [],
  );
  const [openGroups, setOpenGroups] = useState<number[]>([]);

  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  console.log("selectedAddons", selectedAddons);

  const handleAddonSelection = (addonGroupId: number, addonId: number) => {
    const addonGroup = addonsData?.find((group) => group.id === addonGroupId);
    if (!addonGroup) return;

    setSelectedAddons((prevSelected) => {
      if (prevSelected.includes(addonId)) {
        return prevSelected.filter((id) => id !== addonId);
      }

      const groupSelectedAddons = prevSelected.filter((id) =>
        addonGroup.addons.some((addon) => addon.id === id),
      );

      if (groupSelectedAddons.length >= addonGroup.max_select) {
        const newSelected = prevSelected.filter(
          (id) => !addonGroup.addons.some((addon) => addon.id === id),
        );
        return [...newSelected, addonId];
      }

      return [...prevSelected, addonId];
    });
  };

  const handleConfirm = () => {
    console.log("Selected Addons:", selectedAddons);
  };

  return (
    <Sheet open onOpenChange={() => onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-hidden p-0 sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="flex-row items-center justify-between p-4">
            <SheetTitle>Edit attribute</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4">Loading...</div>
            ) : (
              addonsData?.map((group) => (
                <div
                  key={group.id}
                  className="border-brand-main mx-4 mb-2 rounded-md border"
                >
                  <button
                    className="flex w-full items-center justify-between p-4 text-left"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                    </div>
                    {openGroups.includes(group.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {openGroups.includes(group.id) && (
                    <div className="space-y-3 p-4 pt-0">
                      {group.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`addon-${addon.id}`}
                            checked={selectedAddons.includes(addon.id)}
                            onCheckedChange={() =>
                              handleAddonSelection(group.id, addon.id)
                            }
                          />
                          <Label
                            htmlFor={`addon-${addon.id}`}
                            className="flex flex-1 justify-between"
                          >
                            <span>{addon.name}</span>
                            <span className="text-green-600">
                              (+{addon.price} MAD)
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="border-t p-4">
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditAddonsSheet;
