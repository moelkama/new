import { IArticle } from "@/types/orders";
import React from "react";
import ArticleCard from "./ArticleCard";

interface ProductGridProps {
  articles: IArticle[];
  isSearching: boolean;
  searchQuery: string;
  handleAddToCart: (item: IArticle) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  articles,
  isSearching,
  searchQuery,
  handleAddToCart,
}) => {
  if (articles.length === 0) {
    return (
      <div className="my-12 w-full text-center">
        <p className="text-lg text-gray-500">
          {isSearching
            ? `No products found matching "${searchQuery}"`
            : "No products available in this section"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      {articles.map((item) => (
        <ArticleCard
          key={item.id}
          item={item}
          handleAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
export default ProductGrid;
