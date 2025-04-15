import Image from "next/image";
import { tv } from "tailwind-variants";
import { FC } from "react";

export const foodCategoryItem = tv({
  slots: {
    container:
      "bg-light-1 align-center hover:bg-light-3 min-w-[165px] cursor-pointer justify-center rounded-[27px] py-4 text-center transition-colors",

    imageContainer: "",
    image: "m-auto mb-3",

    contentContainer: "",
    title: "text-[14px] font-semibold",
    stockInfo: "text-dark-3 text-[9px] font-normal",
  },
});

const {
  container,
  image,
  contentContainer,
  title: titleClass,
  stockInfo,
} = foodCategoryItem();

interface FoodCategoryItemType {
  title: string;
  imageUrl: string;
  stockCount: number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
const FoodCategoryItem: FC<FoodCategoryItemType> = ({
  title,
  imageUrl,
  stockCount,
  className,
  onClick,
}) => {
  return (
    <div className={container(className)} onClick={onClick}>
      <Image
        draggable="false"
        src={imageUrl}
        width={48}
        height={48}
        alt={`${title} Food Category image`}
        className={image()}
      />
      <div className={contentContainer()}>
        <h2 className={titleClass()}>{title}</h2>
        <span className={stockInfo()}>
          {stockCount} Menu{stockCount !== 1 ? "s" : ""} in Stock
        </span>
      </div>
    </div>
  );
};

export default FoodCategoryItem;
