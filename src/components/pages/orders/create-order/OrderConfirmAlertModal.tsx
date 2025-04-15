import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/shadcn/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  description,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
        router.push("/orders");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, router]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col items-center justify-center p-8">
        <AlertDialogHeader className="flex flex-col items-center gap-8">
          <div className="flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#D2F1F2]">
              <TriangleAlert className="text-brand-main h-20 w-20" />
            </div>
          </div>
          <AlertDialogDescription className="text-primary text-2xl font-bold">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
