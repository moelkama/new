import React, { useState } from "react";
import { useOrderStore } from "@/store/order-store";
import { Package, SquarePlus } from "lucide-react";
import Image from "next/image";
import CustomerInfo from "./CustomerInfo";
import { Separator } from "@/components/shadcn/ui/separator";
import EditOrderProduct from "../order-management/edit-order/EditOrderProductSheet";
import useSingleOrderData from "../order-management/hooks/useSingleOrderData";

const OrderDetails = () => {
  console.log("OrderDetails rendered");
  const { selectedOrder, setSelectedProduct } = useOrderStore();
  console.log("selectedOrder", selectedOrder);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const { orderData, isLoading, isError } = useSingleOrderData(
    selectedOrder?.id ?? 0,
  );

  if (isLoading)
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Loading...</p>
    </div>;

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Error loading orders please try again later</p>
      </div>
    );
  }

  if (!selectedOrder) return null;
  if (!orderData) return null;

  console.log("orderData", orderData);

  return (
    <>
      {isEditSheetOpen && (
        <EditOrderProduct
          onClose={() => setIsEditSheetOpen(false)}
          orderId={orderData.id}
        />
      )}
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">Order id</span>
          </div>
          <span className="text-gray-600">{orderData.id}</span>
        </div>

        <div>
          <div className="mb-2 ml-3 flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">Order detail</span>
          </div>
          <div className="ml-10">
            <p className="mb-2 text-gray-600">
              {orderData?.order_items?.length ?? 0} products
            </p>

            {orderData.order_items?.map((product, index) => (
              <div key={product.id}>
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded bg-gray-100">
                    <Image
                      src={
                        product.article_image ||
                        "/placeholder.svg?height=100&width=100"
                      }
                      alt={product.article_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium">
                        {product.quantity}x
                      </span>
                      <p className="text-sm font-medium text-[#313132]">
                        {product.article_name}
                      </p>
                      {orderData.status === "accepted" && (
                        <button
                          className="text-brand-main cursor-pointer text-xs font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setIsEditSheetOpen(true);
                          }}
                        >
                          {`edit`.toUpperCase()}
                        </button>
                      )}
                    </div>
                    <div className="my-2 ml-8 flex flex-col gap-4">
                      {product.selected_addons_details?.map((extra, i) => (
                        <div key={i}>
                          <p className="text-sm text-[#313132]">
                            1x {extra.id}
                          </p>
                        </div>
                      ))}
                      <p className="text-dark-3 text-xs">
                        {product.total_price} MAD
                      </p>
                    </div>
                  </div>
                </div>
                {/* add seperator */}

                {orderData.order_items &&
                  index !== orderData.order_items.length - 1 && (
                    <Separator className="my-4" />
                  )}

                {/* add new product logic here */}
                {orderData.order_items &&
                  index === orderData.order_items.length - 1 &&
                  orderData.status === "accepted" && (
                    <>
                      <Separator className="my-2" />
                      <button
                        className="flex w-full cursor-pointer items-center justify-center py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // useOrderStore.getState().openCreateOrderSheet();
                        }}
                      >
                        <div className="bg-brand-accent flex w-2/3 items-center justify-center gap-2 rounded-xl py-2">
                          <span className="text-brand-main text-sm font-semibold">
                            Add New
                          </span>
                          <SquarePlus
                            className="text-brand-main font-semibold"
                            fontVariant={"semibold"}
                            size={13}
                          />
                        </div>
                      </button>
                    </>
                  )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">Total price</span>
          </div>
          <span className="text-gray-600">
            {parseFloat(orderData.total_price).toFixed(2)} MAD
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">Order code</span>
          </div>
          <span className="text-gray-600">{orderData.orderCode ?? "--"}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">Payment Method</span>
          </div>
          <span className="text-gray-600">
            {orderData.paymentMethod ?? "--"}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">{"Store's city"}</span>
          </div>
          <span className="text-gray-600">{orderData.storeCity ?? "--"}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">Store name</span>
          </div>
          <span className="text-gray-600">{orderData.storeName ?? "--"}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">Store address</span>
          </div>
          <span className="text-gray-600">
            {orderData.storeAddress ?? "--"}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-teal-100 p-1">
              <Package className="text-brand-main h-4 w-4" />
            </div>
            <span className="font-medium">{"Customer's name"}</span>
          </div>
          <span className="text-gray-600">
            {orderData.customerName ?? "--"}
          </span>
        </div>

        <CustomerInfo />
      </div>
    </>
  );
};

export default OrderDetails;
