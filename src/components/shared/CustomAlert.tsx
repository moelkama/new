import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/shadcn/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import React from "react";

interface DeclineOrderModalProps {
  onConfirm: () => void;
  description?: string;
}

const CustomAlert: React.FC<DeclineOrderModalProps> = ({
  onConfirm,
  description = "This Action is irreversible. Are you sure you want to proceed?",
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
          <AlertDialogDescription className="text-primary text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex w-full items-end justify-end">
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 text-white"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
