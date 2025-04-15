import type { Metadata } from "next";
import StoreStatusPopover from "@/components/shared/StoreStatusPopover";
import StoreLocationPopover from "@/components/shared/StoreLocationPopover";
import { tv } from "tailwind-variants";
import Menu from "./_components/Menu";
import EditMealModal from "./_components/modals/EditMealModal";
import CreateSectionModal from "./_components/modals/CreateSectionModal";
import CreateMealModal from "./_components/modals/CreateMealModal";

export const metadata: Metadata = {
  title: "login page",
  description: "login page description",
};

const styles = tv({
  slots: {
    topBarContainer: "flex justify-end",
    contentContainer: "p-8",
    storeStatusWrapper: "",
    storeLocationWrapper: "",
    pageTitle: "mb-8 text-2xl font-medium",
  },
});

export default function MenuPage() {
  const {
    topBarContainer,
    contentContainer,
    storeStatusWrapper,
    storeLocationWrapper,
  } = styles();

  return (
    <>
      <div className={topBarContainer()}>
        <div className={storeStatusWrapper()}>
          <StoreStatusPopover />
        </div>
        <div className={storeLocationWrapper()}>
          <StoreLocationPopover />
        </div>
      </div>
      <div className={contentContainer()}>
        <Menu />
      </div>
      <CreateSectionModal />
      <EditMealModal />
      <CreateMealModal />
    </>
  );
}
