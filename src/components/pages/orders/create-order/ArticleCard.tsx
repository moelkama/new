import { IArticle } from "@/types/orders";
import React from "react";
import Image from "next/image";
import { Heart, Plus, Star } from "lucide-react";
import recipe from "@/assests/images/test.png";
import { Button } from "@/components/shadcn/ui/button";

interface ArticleCardProps {
  item: IArticle;
  handleAddToCart: (item: IArticle) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ item, handleAddToCart }) => {
  return (
    <div className="group relative min-w-52 overflow-hidden rounded-lg bg-white shadow-sm">
      <button className="absolute top-2 right-2 rounded-full">
        <Heart className="text-brand-main h-5 w-5" />
      </button>
      <div className="relative flex items-center justify-center">
        <Image
          src={recipe || "/placeholder.svg?height=200&width=200"}
          alt="Breakfast Item"
          width={160}
          height={160}
          className=""
        />
        {item.tags && item.tags?.length > 0 && (
          <p className="absolute -bottom-4 left-[35%] rounded-sm bg-[#F7EDD0] px-2 py-1 text-xs font-normal text-[#DAA31A]">
            {item?.tags.join(", ")}
          </p>
        )}
      </div>
      <div className="mt-1 flex flex-col items-center justify-between p-4">
        <h3 className="mb-1 text-base font-semibold">{item.category}</h3>
        <div className="flex w-full items-center justify-evenly">
          <p>{item.calories ?? "--"} qnt.</p>
          <div className="flex items-center justify-center gap-1">
            <Star fill="#FF7A28" color="#FF7A28" size={12} />
            <span className="text-dark-3 text-xs font-medium">
              {item.rating ?? "--"}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="text-brand-main border-brand-main font-bold">
            {`MAD${item.price}`}
          </div>
          <Button
            size="sm"
            className="bg-brand-main border-brand-main h-8 w-8 p-0 hover:bg-teal-600"
            onClick={() => handleAddToCart(item)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
