import type { Metadata } from "next";
import Orders from "@/components/pages/orders";
import StoreStatusPopover from "@/components/shared/StoreStatusPopover";
import StoreLocationPopover from "@/components/shared/StoreLocationPopover";
import { tv } from "tailwind-variants";

export const metadata: Metadata = {
  title: "Orders",
  description: "Showcase of All orders",
};

const styles = tv({
  slots: {
    topBarContainer: "flex justify-end",
    contentContainer: "p-8",
    storeStatusWrapper: "",
    storeLocationWrapper: "",
    pageTitle: "mb-8 text-2xl font-medium",
  },
});

export default function OrdersPage() {
  const { topBarContainer, storeStatusWrapper, storeLocationWrapper } =
    styles();

  return (
    <main className="min-h-screen bg-white">
      <div className={topBarContainer()}>
        <div className={storeStatusWrapper()}>
          <StoreStatusPopover />
        </div>
        <div className={storeLocationWrapper()}>
          <StoreLocationPopover />
        </div>
      </div>
      <Orders />
    </main>
  );
}
