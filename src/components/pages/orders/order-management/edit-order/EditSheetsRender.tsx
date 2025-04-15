import { useOrderStore } from "@/store/order-store";
import EditQuantitySheet from "./EditQuantitySheet";
import EditAddonsSheet from "./EditAddonsSheet";
import ArticlesSheet from "./ArtictlesSheet";
import RemoveProductSheet from "./RemoveProductSheet";

export type EditSheetType =
  | "none"
  | "editQuantity"
  | "editAddons"
  | "editArticles"
  | "removeProduct"
  | "replaceOrder";

interface EditSheetProps {
  onClose: () => void;
  sheetType: EditSheetType;
  orderId: number;
}

const EditSheetsRender: React.FC<EditSheetProps> = ({
  onClose,
  sheetType,
  orderId,
}) => {
  const { selectedProduct } = useOrderStore();

  const renderSheet = () => {
    switch (sheetType) {
      case "editQuantity":
        return (
          <EditQuantitySheet
            onClose={onClose}
            product={selectedProduct}
            orderId={orderId}
          />
        );
      case "editAddons":
        return (
          <EditAddonsSheet
            onClose={onClose}
            product={selectedProduct}
            orderId={orderId}
          />
        );
      case "replaceOrder":
        return (
          <ArticlesSheet
            onClose={onClose}
            product={selectedProduct}
            orderId={orderId}
          />
        );

      case "removeProduct":
        return <RemoveProductSheet onClose={onClose} orderId={orderId} />;

      default:
        return null;
    }
  };

  return renderSheet();
};

export default EditSheetsRender;
