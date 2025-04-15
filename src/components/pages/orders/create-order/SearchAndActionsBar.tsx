import { Input } from "@/components/shadcn/ui/input";
import { Search, ShoppingCart, X } from "lucide-react";
import { RefObject } from "react";
import React from "react";
import Filters from "./Filters";
import { Button } from "@/components/shadcn/ui/button";

interface SearchAndActionsBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
  activeSectionId: number;
  activeSectionName: string;
  itemsCount: number;
  searchInputRef: RefObject<HTMLInputElement | null>;
  openCart: () => void;
  openOrderCreation: () => void;
}

const SearchAndActionsBar: React.FC<SearchAndActionsBarProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
  isSearching,
  activeSectionId,
  activeSectionName,
  itemsCount,
  searchInputRef,
  openCart,
  openOrderCreation,
}) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <h2 className="text-xl font-bold">
        {isSearching
          ? `Search Results: "${searchQuery}"`
          : activeSectionId
            ? activeSectionName.charAt(0).toUpperCase() +
              activeSectionName.slice(1)
            : "All Products"}
      </h2>
      <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="SEARCH PRODUCT"
            className="rounded-md border-gray-200 bg-white pr-10 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-4 px-4">
          <Filters />
          <Button
            variant="outline"
            className="bg-brand-main border-brand-main cursor-pointer whitespace-nowrap text-white hover:bg-teal-600 hover:text-white"
            onClick={openCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            <p className="text-brand-main border-brand-main ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white p-0">
              {itemsCount}
            </p>
          </Button>
          <Button
            onClick={openOrderCreation}
            className="bg-brand-main border-brand-main whitespace-nowrap text-white hover:bg-teal-600"
          >
            Create Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndActionsBar;
