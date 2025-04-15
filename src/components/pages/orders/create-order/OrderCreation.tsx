"use client";
import React, { useRef, useState } from "react";
import { useCartStore } from "@/store/orders/order-cart";
import CartSheet from "./CartSheet";
import CreateNewOrderAlert from "./CreateNewOrderAlert";
import CreateCustomerSheet from "./sheets/CreateCustomerSheet";
import Sections from "./Sections";
import { IArticle } from "@/types/orders";
import useSearchStore from "@/store/orders/searchStore";
import SearchAndActionsBar from "./SearchAndActionsBar";
import ProductGrid from "./ProductGrid";
import { useMenuData } from "./hooks/useMenuData";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useOrderCreationFlow } from "./hooks/useOrderCreationFlow";

const OrderCreation = () => {
  const { searchQuery, setSearchQuery, resetQuery } = useSearchStore();
  const [activeSectionId, setActiveSectionId] = useState<number>(0);
  const [activeSectionName, setActiveSectionName] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const itemsCount = useCartStore((state) => state.totalItems);
  const addToCart = useCartStore((state) => state.addItem);

  const {
    isCartOpen,
    isOrderCreationModalOpen,
    isCreateCustomerSheetOpen,
    openCart,
    closeCart,
    openCreateCustomerSheet,
    closeCreateCustomerSheet,
    openOrderCreation,
    closeCreationAlert,
  } = useOrderCreationFlow();

  const {
    allArticles,
    isSearching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
    refetch,
  } = useMenuData(activeSectionId);

  const observerTarget = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const handleAddToCart = (item: IArticle) => {
    console.log("Adding to cart: ", item);
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item?.image,
      description: item.description ?? "--",
      available_addons: item.available_addons,
    });
  };

  const handleSectionChange = (id: number, name: string) => {
    if (isSearching) {
      resetQuery();
    }
    setActiveSectionId(id);
    setActiveSectionName(name);
  };

  const clearSearch = () => {
    resetQuery();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    refetch();
  };

  if (isError) {
    return <>Something went wrong try again later</>;
  }

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isCartOpen && <CartSheet onClose={closeCart} isOpen={isCartOpen} />}

      {isCreateCustomerSheetOpen && (
        <CreateCustomerSheet
          onClose={closeCreateCustomerSheet}
          isOpen={isCreateCustomerSheetOpen}
        />
      )}

      {isOrderCreationModalOpen && (
        <CreateNewOrderAlert
          onCartOpen={() => {
            closeCreationAlert();
            openCart();
          }}
          onCreateNewOrder={() => {
            closeCreationAlert();
            openCreateCustomerSheet();
          }}
        />
      )}
      <div className="container mx-auto gap-8 px-4 py-6">
        <h2 className="text-xl font-bold">Sections</h2>

        <Sections onSectionChange={handleSectionChange} />

        <SearchAndActionsBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          isSearching={isSearching}
          activeSectionId={activeSectionId}
          activeSectionName={activeSectionName}
          itemsCount={itemsCount}
          searchInputRef={searchInputRef}
          openCart={openCart}
          openOrderCreation={openOrderCreation}
        />

        <ProductGrid
          articles={allArticles}
          isSearching={isSearching}
          searchQuery={searchQuery}
          handleAddToCart={handleAddToCart}
        />

        <div ref={observerTarget} className="h-10 w-full">
          {isFetchingNextPage && (
            <div className="my-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderCreation;
