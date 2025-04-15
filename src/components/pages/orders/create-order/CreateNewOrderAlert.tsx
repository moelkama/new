import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/shadcn/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";

interface AlertModalProps {
  onCartOpen: () => void;
  onCreateNewOrder: () => void;
}

const CreateNewOrderAlert: React.FC<AlertModalProps> = ({
  onCartOpen,
  onCreateNewOrder,
}) => {
  return (
    <AlertDialog open>
      <AlertDialogContent className="flex flex-col items-center justify-center p-8">
        <AlertDialogHeader className="flex flex-col items-center gap-8">
          <div className="flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#D2F1F2]">
              <TriangleAlert className="text-brand-main h-20 w-20" />
            </div>
          </div>
          <AlertDialogDescription className="text-primary text-2xl font-bold">
            New Order ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex w-full items-end justify-end">
          <AlertDialogCancel
            onClick={onCartOpen}
            className="text-brand-main bg-[#D2F1F2]"
          >
            Cart
          </AlertDialogCancel>
          <AlertDialogAction onClick={onCreateNewOrder}>
            Create New Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewOrderAlert;
