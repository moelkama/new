"use client";
import { TbCurrentLocation } from "react-icons/tb";
import { useEffect } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import * as RadixLabel from "@radix-ui/react-label";
import Checkbox from "../ui/CheckBox";
import PopoverTrigger from "../ui/PopoverTrigger";
import { tv } from "tailwind-variants";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useRestaurants } from "@/hooks/apis/useRestaurants";

const styles = tv({
  slots: {
    content:
      "border-light-4 w-s rounded-2xl border-1 bg-white px-8 py-5 shadow-md",
    header: "mb-5 flex items-center gap-3",
    title: "text-[12px]",
    optionsContainer: "flex flex-col gap-2",
    option:
      "border-brand-accent flex min-w-[270px] items-center justify-center rounded-lg border-[0.5px] px-4 py-2",
    optionLabel: "cursor-pointer items-center justify-start gap-4",
    optionTitle: "mb-1 text-[10.88px] font-medium",
    optionDescription: "text-dark-3 text-[9.88px] font-normal",
    loadingState: "py-2 text-center text-[12px] text-gray-500",
    errorState: "py-2 text-center text-[12px] text-red-500",
  },
});

const {
  content,
  header,
  title,
  optionsContainer,
  option,
  optionLabel,
  optionTitle,
  optionDescription,
  loadingState,
  errorState,
} = styles();

const StoreLocationPopover = () => {
  const { selectedRestaurantId, setSelectedRestaurantId } =
    useRestaurantStore();

  const { data: restaurants = [], isLoading, error } = useRestaurants();

  useEffect(() => {
    if (!selectedRestaurantId && restaurants.length > 0) {
      setSelectedRestaurantId(restaurants[0]?.id ?? null);
    }
  }, [restaurants, selectedRestaurantId, setSelectedRestaurantId]);

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId,
  );

  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        <PopoverTrigger
          icon={<TbCurrentLocation size={50} />}
          text={selectedRestaurant?.name || "Select Location"}
        />
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content sideOffset={5} className={content()}>
          <div className={header()}>
            <h3 className={title()}>Choose a Restaurant Location</h3>
          </div>
          <div className={optionsContainer()}>
            {isLoading ? (
              <div className={loadingState()}>Loading restaurants...</div>
            ) : error ? (
              <div className={errorState()}>Error loading restaurants</div>
            ) : restaurants.length === 0 ? (
              <div className={loadingState()}>No restaurants available</div>
            ) : (
              restaurants.map((restaurant, index) => (
                <LocationOption
                  key={restaurant.id ?? index}
                  id={`restaurant-${restaurant.id ?? index}`}
                  checked={selectedRestaurantId === restaurant.id}
                  onChange={() => setSelectedRestaurantId(restaurant.id)}
                  title={restaurant.name}
                  description={`${restaurant.location.address || ""}, ${
                    restaurant.location.city || ""
                  }`}
                />
              ))
            )}
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

interface LocationOptionProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}

const LocationOption = ({
  id,
  checked,
  onChange,
  title,
  description,
}: LocationOptionProps) => (
  <RadixPopover.Close
    aria-label="Close"
    asChild
    tabIndex={-1}
    onClick={onChange}
  >
    <RadixLabel.Root htmlFor={id} className={`${optionLabel()} ${option()}`}>
      <Checkbox
        size="large"
        checked={checked}
        onCheckedChange={onChange}
        id={id}
      />
      <div>
        <h4 className={optionTitle()}>{title}</h4>
        <p className={optionDescription()}>{description}</p>
      </div>
    </RadixLabel.Root>
  </RadixPopover.Close>
);

export default StoreLocationPopover;
