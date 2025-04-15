import Image from "next/image";
import { TbStarFilled } from "react-icons/tb";
import { tv } from "tailwind-variants";

// Define food category types
type FoodCategory = "fast_food" | "healthy" | "snack";

// Define TV slots with variants
const menuItemStyles = tv({
  slots: {
    container:
      "flex flex-col items-center gap-4 rounded-[27.11px] border-1 border-[#f4f4f6] bg-white p-6 text-center shadow-[5px_15px_33px_#e5e5e554]",
    imageContainer: "",
    image: "",
    categoryBadge:
      "rounded-[2.74px] px-[4.5px] py-[1.5px] text-[10px] font-normal",
    content: "",
    title: "mt-[5px] mb-[1px] text-[18px] font-semibold text-[#323142]",
    detailsRow:
      "flex items-center justify-center gap-2 text-[12px] text-[#8E97A6]",
    quantity: "font-normal",
    separator: "",
    ratingContainer: "flex items-center justify-center gap-1",
    starIcon: "text-[#8928ff]",
    ratingValue: "",
  },
  variants: {
    foodType: {
      fast_food: {
        categoryBadge: "bg-[#F7C5BA] text-[#FB471D]",
      },
      healthy: {
        categoryBadge: "bg-[#F7EDD0] text-[#DAA31A]",
      },
      snack: {
        categoryBadge: "bg-[#33ac644d] text-[#309D5B]",
      },
    },
    quantityStatus: {
      low: {
        quantity: "font-semibold text-[#D92D20]",
      },
      medium: {
        // quantity: "",
      },
      high: {
        // quantity: "",
      },
    },
  },
  defaultVariants: {
    foodType: "healthy",
    quantityStatus: "medium",
  },
});

interface MenuItemProps {
  imageSrc: string;
  imageAlt?: string;
  category: FoodCategory;
  title: string;
  quantity: number;
  rating: string;
  className?: string;
  sectionId?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  imageSrc,
  imageAlt = "Menu Item",
  category,
  title,
  quantity: itemQuantity,
  rating,
  className = "",
}) => {
  const getQuantityStatus = (qty: number) => {
    if (qty < 10) return "low";
    if (qty < 30) return "medium";
    return "high";
  };

  const quantityStatus = getQuantityStatus(itemQuantity);

  const {
    container,
    imageContainer,
    image,
    categoryBadge,
    content,
    title: titleClass,
    detailsRow,
    quantity,
    separator,
    ratingContainer,
    starIcon,
    ratingValue,
  } = menuItemStyles({ foodType: category, quantityStatus });

  return (
    <div className={container({ className })}>
      <div className={imageContainer()}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={118}
          height={118}
          className={image()}
        />
      </div>
      <div className={content()}>
        <div>
          <span className={categoryBadge()}>{category.replace("_", " ")}</span>
        </div>
        <h4 className={titleClass()}>{title}</h4>
        <div className={detailsRow()}>
          <span className={quantity()}>
            {getQuantityStatus(itemQuantity) === "low" && "Remaining "}
            {itemQuantity}
            {getQuantityStatus(itemQuantity) === "medium" && "qnt"}
            {getQuantityStatus(itemQuantity) === "high" && "qnt"}
          </span>
          <span className={separator()}>•</span>
          <div className={ratingContainer()}>
            <span className={starIcon()}>
              <TbStarFilled />
            </span>
            <span className={ratingValue()}>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
