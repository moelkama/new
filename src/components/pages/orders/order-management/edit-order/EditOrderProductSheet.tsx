"use client";

import { Button } from "@/components/shadcn/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/ui/sheet";
import { useOrderStore } from "@/store/order-store";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import EditSheetsRender, { EditSheetType } from "./EditSheetsRender";

interface EditOrderProductProps {
  onClose: () => void;
  orderId: number;
}

const EditOrderProduct = ({ onClose, orderId }: EditOrderProductProps) => {
  const { selectedProduct } = useOrderStore();
  const [sheetType, setSheetType] = useState<EditSheetType>("none");
  if (!selectedProduct) return null;

  console.log("selectedProduct", selectedProduct);

  return (
    <>
      {sheetType !== "none" && (
        <EditSheetsRender
          onClose={() => setSheetType("none")}
          sheetType={sheetType}
          orderId={orderId}
        />
      )}
      <Sheet open onOpenChange={() => onClose()}>
        <SheetContent
          side="right"
          className="w-full overflow-hidden p-0 sm:max-w-md"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="flex-row items-center justify-between border-b p-4">
              <SheetTitle>Edit {selectedProduct.article_name}</SheetTitle>
              {/* <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              </Button> */}
            </SheetHeader>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              <Button
                variant="outline"
                className="bg-brand-accent h-13 w-full cursor-pointer justify-between"
                onClick={() => {
                  setSheetType("editQuantity");
                }}
              >
                <div className="flex items-center">
                  <div className="mr-3 rounded-md bg-gray-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </div>
                  EDIT QUANTITY
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="bg-brand-accent h-13 w-full cursor-pointer justify-between"
                onClick={() => {
                  setSheetType("replaceOrder");
                }}
              >
                <div className="flex items-center">
                  <div className="mr-3 rounded-md bg-gray-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                      <path d="M16 21h5v-5"></path>
                    </svg>
                  </div>
                  REPLACE ORDER
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="bg-brand-accent h-13 w-full cursor-pointer justify-between"
                onClick={() => {
                  setSheetType("editAddons");
                }}
              >
                <div className="flex items-center">
                  <div className="mr-3 rounded-md bg-gray-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </div>
                  edit ADD-ONS{" "}
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="bg-brand-accent h-13 w-full cursor-pointer justify-between"
                onClick={() => {
                  setSheetType("removeProduct");
                }}
              >
                <div className="flex items-center">
                  <div className="mr-3 rounded-md bg-gray-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </div>
                  REMOVE PRODUCT
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditOrderProduct;
