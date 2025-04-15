"use client";
import { FC, useState } from "react";
import CategorySection from "./CategorySection/CategorySection";
import MenuSection from "./MenuSection/MenuSection";

const Menu: FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<number>(-1);

  const handleSectionSelect = (sectionId: number) => {
    setSelectedSectionId(sectionId);
  };
  return (
    <>
      <CategorySection
        onCategorySelect={handleSectionSelect}
        selectedSectionId={selectedSectionId}
      />
      <MenuSection sectionId={selectedSectionId} />
    </>
  );
};

export default Menu;
