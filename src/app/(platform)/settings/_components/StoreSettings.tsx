"use client";

import StoreSettingsCard from "@/components/ui/cards/StoreSettingsCard";
import { useRestaurants } from "@/hooks/apis/useRestaurants";
import { tv } from "tailwind-variants";
import ContentLoader from "react-content-loader";

const styles = tv({
  base: "mb-5 grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
});

interface StoreSettingsProps {
  className?: string;
}

// Enhanced store card skeleton
const StoreCardSkeleton = () => (
  <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
    <ContentLoader
      speed={2}
      width={336}
      height={246}
      viewBox="0 0 336 246"
      backgroundColor="#f3f3f3"
      foregroundColor="#ebecec"
    >
      {/* Store image/banner */}
      <rect x="0" y="0" rx="0" ry="0" width="336" height="140" />

      {/* Store name */}
      <rect x="2" y="156" rx="3" ry="3" width="180" height="18" />

      {/* Action buttons */}
      <rect x="240" y="156" rx="3" ry="3" width="80" height="18" />
    </ContentLoader>
  </div>
);

const StoreSettings: React.FC<StoreSettingsProps> = ({ className }) => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) {
    return (
      <div className={styles({ className })}>
        {Array.from({ length: 4 }).map((_, i) => (
          <StoreCardSkeleton key={`skeleton-store-${i}`} />
        ))}
      </div>
    );
  }

  // Handle error state
  if (error || !restaurants) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-500">
        Failed to load restaurants. Please try again.
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex justify-center items-center w-full p-8 rounded-md bg-gray-50">
        <h1 className="text-lg font-medium text-gray-500">No restaurants available.</h1>
      </div>
    );
  }

  return (
    <div className={styles({ className })}>
      {restaurants.map((restaurant) => (
        <StoreSettingsCard
          key={`store_${restaurant.id}`}
          restaurant={restaurant}
        />
      ))}
    </div>
  );
};

export default StoreSettings;