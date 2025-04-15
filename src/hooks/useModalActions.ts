import { useModalStore } from "@/store/modal-store";

export function useModalActions() {
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  const closeAllModals = useModalStore((state) => state.closeAllModals);

  return {
    open: openModal,
    close: closeModal,
    closeAll: closeAllModals,
  };
}

export default useModalActions;
