import Image from "next/image";
import { FiSettings } from "react-icons/fi";
import { tv, VariantProps } from "tailwind-variants";
import { ModalTrigger } from "../Modal";
import { Restaurant } from "@/hooks/apis/useRestaurants";

const StoreSettingsCardStyles = tv({
  slots: {
    container: "relative flex cursor-pointer flex-col rounded-2xl",
    imageContainer: "block aspect-[21/11] rounded-2xl",
    image: "h-full w-full rounded-2xl object-cover",

    settingsButton:
      "transparent hover:text-brand-main absolute top-2 right-2 cursor-pointer rounded-full p-2 text-2xl text-white transition-colors",

    infoContainer: "flex items-center justify-between pt-4",
    title: "text-body-normal font-medium",
    statusBadge: "rounded-[4px] px-2 py-1 text-xs font-medium",
  },
  variants: {
    isOpen: {
      true: {
        statusBadge: "bg-brand-accent text-brand-main",
      },

      false: {
        statusBadge: "",
      },
    },
  },
});

interface StoreSettingsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof StoreSettingsCardStyles> {
  restaurant: Restaurant;
}

const StoreSettingsCard: React.FC<StoreSettingsCardProps> = ({
  restaurant,
  className,
  ...props
}) => {
  const {
    container,
    imageContainer,
    settingsButton,
    infoContainer,
    title,
    statusBadge,
    image,
  } = StoreSettingsCardStyles({
    isOpen: restaurant.status.isOpen,
    className,
  });

  return (
    <ModalTrigger
      modalType="store_settings_modal"
      modalProps={{
        restaurant,
      }}
    >
      <div className={container()} {...props}>
        <div className={imageContainer()}>
          <Image
            width={400}
            height={400}
            //src={restaurant.image ?? "https://placehold.co/600x400.png"}
            src={"https://placehold.co/600x400.png"}
            alt={`${restaurant.name} store`}
            className={image()}
          />

          <button className={settingsButton()} aria-label="Settings">
            <FiSettings />
          </button>
        </div>

        <div className={infoContainer()}>
          <span className={title()}>{restaurant.name}</span>

          <div className={statusBadge({ isOpen: restaurant.status.isOpen })}>
            {restaurant.status.isOpen ? "Store is Open" : "Store is Closed"}
          </div>
        </div>
      </div>
    </ModalTrigger>
  );
};

export default StoreSettingsCard;
