import { useQuery } from "@tanstack/react-query";
import MenuItem from "./MenuItem";
import { api } from "../../data";
import { ModalTrigger } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  FiGrid,
  FiList,
  FiPlus,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";
import { useViewModeStore } from "@/store/viewModeStore";
import Switch from "@/components/ui/Switch";
import { useState } from "react";
import Image from "next/image";

interface CategorySectionProps {
  sectionId: number;
}

const MenuSection = ({ sectionId }: CategorySectionProps) => {
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals", sectionId],
    queryFn: () => api.getMealsBySection(sectionId),
  });

  // Use view mode from store
  const { viewMode, toggleViewMode } = useViewModeStore();

  // Track active and promo states
  const [activeItems, setActiveItems] = useState<Record<number, boolean>>({});
  const [promoItems, setPromoItems] = useState<Record<number, boolean>>({});

  // Initialize states from data on first load
  useState(() => {
    const active: Record<number, boolean> = {};
    const promo: Record<number, boolean> = {};
    meals.forEach((meal) => {
      active[meal.id] = true; // Default all to active
      promo[meal.id] = false; // Default all to non-promo
    });
    setActiveItems(active);
    setPromoItems(promo);
  });

  // Toggle handlers
  const toggleActive = (id: number) => {
    setActiveItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const togglePromo = (id: number) => {
    setPromoItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const loadingUi = (
    <div className="col-span-full flex h-40 items-center justify-center">
      <p className="text-center text-lg font-semibold">Loading meals...</p>
    </div>
  );

  const noSectionSelectedUi = (
    <div className="col-span-full flex h-40 items-center justify-center">
      <p className="text-center text-lg font-semibold">No section selected.</p>
    </div>
  );

  const emptyMealsUi = (
    <div className="col-span-full flex h-40 items-center justify-center">
      <p className="text-center text-lg font-semibold">
        No meals available in this section.
      </p>
    </div>
  );

  // Table view for meals
  const renderTableView = () => (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full">
        <thead className="">
          <tr className="bg-light-2 text-dark-2">
            <th
              scope="col"
              className="text-dark-2 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
            >
              Product
            </th>
            <th
              scope="col"
              className="text-dark-2 px-6 py-3 text-center text-xs font-medium tracking-wider uppercase"
            >
              Section
            </th>
            <th
              scope="col"
              className="text-dark-2 px-6 py-3 text-center text-xs font-medium tracking-wider uppercase"
            >
              Price
            </th>
            <th
              scope="col"
              className="text-dark-2 px-6 py-3 text-center text-xs font-medium tracking-wider uppercase"
            >
              Details
            </th>
            <th
              scope="col"
              className="text-dark-2 px-6 py-3 text-center text-xs font-medium tracking-wider uppercase"
            >
              Active
            </th>
            <th
              scope="col"
              className="text-dark-2 px-6 py-3 text-center text-xs font-medium tracking-wider uppercase"
            >
              Promo
            </th>
            <th
              scope="col"
              className="text-dark-2 px-6 py-3 text-center text-xs font-medium tracking-wider uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {meals.map((item) => (
            <tr key={item.id} className="hover:bg-light-1">
              {/* Product name and image - left aligned */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Image
                    src={item.image}
                    alt={item.label}
                    className="mr-3 h-10 w-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  <span className="text-dark-1 font-medium">{item.label}</span>
                </div>
              </td>
              {/* All other columns - centered */}
              <td className="text-dark-2 px-6 py-4 text-center text-sm whitespace-nowrap">
                {`Section ${item.sectionId}`}
              </td>
              <td className="text-dark-2 px-6 py-4 text-center text-sm whitespace-nowrap">
                ${((item.id % 10) + 10).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                <div className="flex justify-center">
                  <ModalTrigger modalType="edit_meal_modal">
                    <button className="text-primary-600 hover:text-primary-900 inline-flex items-center rounded p-1">
                      <FiChevronRight size={18} />
                    </button>
                  </ModalTrigger>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                <Switch
                  size="small"
                  checked={activeItems[item.id] ?? true}
                  onCheckedChange={() => toggleActive(item.id)}
                />
              </td>
              <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                <Switch
                  size="small"
                  checked={promoItems[item.id] ?? false}
                  onCheckedChange={() => togglePromo(item.id)}
                />
              </td>
              <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                <div className="flex justify-center">
                  <button className="rounded p-1 text-red-500 hover:text-red-700">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Grid view for meals
  const renderGridView = () => (
    <div className="grid grid-cols-1 gap-8 pb-40 md:grid-cols-2 lg:grid-cols-4">
      {meals.map((item) => (
        <ModalTrigger key={item.id} modalType="edit_meal_modal">
          <MenuItem
            imageSrc={item.image}
            category={item.category}
            title={item.label}
            quantity={item.quantity}
            rating={item.rating}
            sectionId={item.sectionId}
          />
        </ModalTrigger>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="my-5 text-2xl font-medium">
          {sectionId !== -1 ? "Section Name" : ""}
        </h1>
        <div className="flex items-center gap-2">
          {/* View mode toggle buttons */}
          <div className="bg-light-2 mr-2 flex rounded-lg p-1">
            <button
              onClick={() => viewMode !== "grid" && toggleViewMode()}
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                viewMode === "grid" ? "bg-white shadow-sm" : "text-dark-3"
              }`}
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => viewMode !== "table" && toggleViewMode()}
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                viewMode === "table" ? "bg-white shadow-sm" : "text-dark-3"
              }`}
            >
              <FiList size={18} />
            </button>
          </div>
          <ModalTrigger modalType="create_meal_modal">
            <Button
              className="cursor-pointer gap-5 p-3 text-[14px] font-semibold"
              leftIcon={FiPlus}
              size="sm"
            >
              Add
            </Button>
          </ModalTrigger>
        </div>
      </div>

      {/* Conditional content rendering */}
      {sectionId === -1
        ? noSectionSelectedUi
        : isLoading
          ? loadingUi
          : meals.length === 0
            ? emptyMealsUi
            : viewMode === "grid"
              ? renderGridView()
              : renderTableView()}
    </div>
  );
};

export default MenuSection;
