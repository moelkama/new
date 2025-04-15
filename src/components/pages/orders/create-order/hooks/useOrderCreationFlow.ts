import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useOrderCreationFlow() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderCreationModalOpen, setIsOrderCreationModalOpen] =
    useState(false);
  const [isCreateCustomerSheetOpen, setIsCreateCustomerSheetOpen] =
    useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isNewOrder = searchParams.get("isNewOrder") === "true";
    const isNewOrderModalOpen =
      searchParams.get("isNewOrderModalOpen") === "true";

    setIsOrderCreationModalOpen(isNewOrder && isNewOrderModalOpen);
  }, [searchParams]);

  const closeCreationAlert = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("isNewOrderModalOpen", "false");
    router.replace(`/orders?${params.toString()}`, { scroll: false });
    setIsOrderCreationModalOpen(false);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCreateCustomerSheet = () => setIsCreateCustomerSheetOpen(true);
  const closeCreateCustomerSheet = () => setIsCreateCustomerSheetOpen(false);
  const openOrderCreation = () => setIsOrderCreationModalOpen(true);

  return {
    isCartOpen,
    isOrderCreationModalOpen,
    isCreateCustomerSheetOpen,
    openCart,
    closeCart,
    openCreateCustomerSheet,
    closeCreateCustomerSheet,
    openOrderCreation,
    closeCreationAlert,
  };
}
