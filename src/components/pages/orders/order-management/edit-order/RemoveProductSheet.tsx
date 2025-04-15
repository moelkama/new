import { Button } from "@/components/shadcn/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/ui/sheet";
import { IOrderArticle } from "@/types/orders";
import Image from "next/image";
import { useState } from "react";
import useSingleOrderData from "../hooks/useSingleOrderData";

interface EditSheetProps {
  onClose: () => void;
  orderId: number;
}

const RemoveProductSheet: React.FC<EditSheetProps> = ({ onClose, orderId }) => {
  const [selectedArticle, setSelectedArticle] = useState<number[]>([]);
  const { orderData, isLoading, isError } = useSingleOrderData(orderId);

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">Error loading articles</div>
      </div>
    );
  }

  const isArticleSelected = (articleId: number) => {
    return selectedArticle?.some((item) => item === articleId);
  };

  const handleArticleSelect = (article: IOrderArticle) => {
    // add selected article id to selectedArticle array
    if (selectedArticle.includes(article.id)) {
      setSelectedArticle((prev) => prev.filter((id) => id !== article.id));
    } else {
      setSelectedArticle((prev) => [...prev, article.id]);
    }
  };

  const handleRemoveSelectedArticles = () => {
    // rmove sleected articles from order
    const newOrderItems = orderData?.order_items?.filter(
      (item) => !selectedArticle.includes(item.id),
    );

    console.log("newOrderItems", newOrderItems);
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-hidden p-0 sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="flex-row items-center justify-between border-b p-4">
            <SheetTitle>Remove Article</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {orderData?.order_items?.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => handleArticleSelect(article)}
                    className={`flex items-center rounded-md border p-2 ${
                      isArticleSelected(article.id)
                        ? "border-teal-500 bg-teal-50"
                        : ""
                    }`}
                  >
                    <div className="relative mr-3 h-16 w-16 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={
                          article.article_image ||
                          "/placeholder.svg?height=100&width=100"
                        }
                        alt={article.article_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{article.article_name}</p>
                        <p className="text-sm text-gray-500">
                          MAD {article.article_price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <Button
              className="bg-brand-main w-full"
              onClick={handleRemoveSelectedArticles}
            >
              Confirm
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RemoveProductSheet;
