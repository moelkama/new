"use client";

import { FC, useRef, useState, useEffect, MouseEvent } from "react";
import { tv } from "tailwind-variants";
import FoodCategoryItem from "./CategoryItem";
import { api } from "../../data";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";
import { ModalTrigger } from "@/components/ui/Modal";

interface CategorySectionProps {
  className?: string;
  onCategorySelect: (sectionId: number) => void;
  selectedSectionId: number | null;
}

const CategorySectionStyles = tv({
  slots: {
    //
    container:
      "scrollbar-h-0.5 scrollbar flex w-full flex-nowrap gap-3 overflow-auto pb-2 whitespace-nowrap select-none",
  },
  variants: {
    isDragging: {
      true: {
        container: "cursor-grabbing",
      },
      false: {
        container: "cursor-grab",
      },
    },
  },
  defaultVariants: {
    isDragging: false,
  },
});

const CategorySection: FC<CategorySectionProps> = ({
  className,
  onCategorySelect,
}) => {
  const { data: menuCategories, isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: api.getSections,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { container } = CategorySectionStyles({ isDragging });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      }
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return <div>Loading sections...</div>;
  }

  return (
    <div className={`py-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mb-5 text-2xl font-medium">Section</h1>
        <ModalTrigger modalType="create_section_modal">
          <Button
            className="cursor-pointer gap-5 p-3 text-[14px] font-semibold"
            leftIcon={FiPlus}
            size="sm"
          >
            add new section
          </Button>
        </ModalTrigger>
      </div>
      <div
        ref={containerRef}
        className={container()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        aria-label="Food categories"
      >
        {menuCategories?.map(({ image, title, stockCount, id }) => (
          <FoodCategoryItem
            onClick={() => onCategorySelect(id)}
            key={`${title}_${stockCount}`}
            imageUrl={image}
            title={title}
            stockCount={stockCount}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
