import React, { useState } from "react";
import Image from "next/image";
import { useApi } from "@/hooks/apis/useApi";
import { ISection } from "@/types/orders";
import { ScrollArea, ScrollBar } from "@/components/shadcn/ui/scroll-area";
import { useRestaurantStore } from "@/store/restaurantStore";

const menu_id = "1";

interface ISectionsProps {
  onSectionChange: (id: number, name: string) => void;
}

const Sections: React.FC<ISectionsProps> = ({ onSectionChange }) => {
  const [activeSection, setActiveSection] = useState(0);
  const { selectedRestaurantId } = useRestaurantStore();

  const { useApiQuery } = useApi();
  const {
    data: sections,
    isLoading,
    isFetching,
  } = useApiQuery<ISection>(
    `/menu/restaurants/${selectedRestaurantId}/menus/${menu_id}/sections/`,
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  if (isFetching) {
    return <div>Loading...</div>; // todo: Add a proper loading state
  }

  if (isLoading || !sections || sections.results.length === 0) {
    return <div>No sections available</div>;
  }

  return (
    <ScrollArea className="w-full overflow-x-auto py-4 whitespace-nowrap">
      <div className="mb-8 flex flex-nowrap gap-2 overflow-x-auto px-2">
        {sections.results?.map((section) => (
          <button
            key={section.id}
            className={`flex min-w-[120px] flex-col items-center justify-center rounded-md p-4 transition-colors ${
              activeSection === section.id
                ? "bg-white shadow-md"
                : "bg-light-1 hover:bg-light-3"
            }`}
            onClick={() => {
              setActiveSection(section.id);
              onSectionChange(section.id, section.name);
            }}
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center">
              <Image
                src={section.image || "/placeholder.svg?height=200&width=200"}
                alt={section.description + " image"}
                width={40}
                height={40}
              />
            </div>
            <span className="text-sm font-medium">{section.name}</span>
            <span className="text-xs text-gray-500">
              {section.stock ?? "--"} Menu In Stock
            </span>
          </button>
        ))}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Sections;
