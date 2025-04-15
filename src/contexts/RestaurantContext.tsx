"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useRestaurants, Restaurant } from "../hooks/apis/useRestaurants";

interface RestaurantContextType {
  selectedRestaurantId: number | null;
  setSelectedRestaurantId: (id: number | null) => void;
  allRestaurants: Restaurant[];
  isLoading: boolean;
  error: Error | null;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    number | null
  >(null);
  const { data: allRestaurants = [], isLoading, error } = useRestaurants();

  // Automatically select first restaurant if none selected and data is loaded
  React.useEffect(() => {
    if (
      !selectedRestaurantId &&
      allRestaurants.length > 0 &&
      allRestaurants[0].id
    ) {
      setSelectedRestaurantId(allRestaurants[0].id);
    }
  }, [allRestaurants, selectedRestaurantId]);

  return (
    <RestaurantContext.Provider
      value={{
        selectedRestaurantId,
        setSelectedRestaurantId,
        allRestaurants,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error(
      "useRestaurantContext must be used within a RestaurantProvider",
    );
  }
  return context;
};
