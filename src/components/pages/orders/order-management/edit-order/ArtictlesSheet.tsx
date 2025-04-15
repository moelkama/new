import { Button } from "@/components/shadcn/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/ui/sheet";
import { IOrderArticle } from "@/types/orders";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMenuData } from "../../create-order/hooks/useMenuData";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import AddAddonsSheet from "./AddAddonsSheet";
import { useReplaceOrderStore } from "@/store/orders/replaceOrderStore";

interface EditSheetProps {
  onClose: () => void;
  orderId: number;
  product: IOrderArticle | null;
}

const ArticlesSheet: React.FC<EditSheetProps> = ({
  onClose,
  product,
  // orderId,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<number>(0);
  const [selectedArticle, setSelectedArticle] = useState<IOrderArticle | null>(
    null,
  );
  const [isAddonSheetOpen, setIsAddonSheetOpen] = useState(false);
  const { orderItems, addItem } = useReplaceOrderStore();

  const {
    allArticles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
    refetch,
  } = useMenuData(activeSectionId);

  const observerTarget = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );
  console.log("menu: ", allArticles);
  if (!product) return null;
  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">Error loading articles</div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const isArticleSelected = (articleId: number) => {
    return orderItems.some((item) => item.article === articleId);
  };

  const handleArticleSelect = (article: IOrderArticle) => {
    setSelectedArticle(article);
    addItem(article.id);
  };

  console.log("selectedArticle", selectedArticle);
  console.log("orderItems", orderItems);

  return (
    <>
      <Sheet open onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="w-full overflow-hidden p-0 sm:max-w-md"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="flex-row items-center justify-between border-b p-4">
              <SheetTitle>Articles</SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex gap-4">
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setActiveSectionId(0)}
                  >
                    {activeSectionId === 0
                      ? "All products"
                      : `Section ${activeSectionId}`}
                    <ChevronRight className="h-5 w-5 rotate-90" />
                  </Button>
                </div>
              </div>

              {status === "pending" ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {allArticles?.map((article) => (
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
                            article.image ||
                            "/placeholder.svg?height=100&width=100"
                          }
                          alt={article.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{article.name}</div>
                            <div className="text-sm text-gray-500">
                              MAD {article.price}
                              {isArticleSelected(article.id) && (
                                <span className="ml-2 text-teal-600">
                                  (added)
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-brand-accent h-auto p-0"
                            disabled={!article.is_available}
                            onClick={() => setIsAddonSheetOpen(true)}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div ref={observerTarget} className="h-10 w-full">
                {isFetchingNextPage && (
                  <div className="my-4 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t p-4">
              <Button className="w-full bg-teal-500 hover:bg-teal-600">
                Confirm
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {isAddonSheetOpen && (
        <AddAddonsSheet
          onClose={() => setIsAddonSheetOpen(false)}
          product={product}
        />
      )}
    </>
  );
};

export default ArticlesSheet;
