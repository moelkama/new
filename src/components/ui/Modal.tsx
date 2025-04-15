"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MdClose } from "react-icons/md";
import { tv } from "tailwind-variants";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "radix-ui";
import { ModalType, useModalStore } from "@/store/modal-store";

const styles = tv({
  slots: {
    overlay: "fixed inset-0 z-50 bg-black/16",
    content:
      "relative inline-block max-h-[85vh] w-[90vw] overflow-y-auto rounded-2xl bg-white px-11 py-9 shadow-lg focus:outline-none",
    asideContent:
      "fixed inset-y-0 right-0 h-full w-full max-w-md overflow-y-auto bg-white px-8 py-9 shadow-lg focus:outline-none sm:w-[450px]",
    titleVisible: "mb-4 text-xl font-medium text-gray-900",
    titleHidden: "sr-only",
    closeButton:
      "absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100/80",
    closeIcon: "h-6 w-6 text-gray-500",
    container: "fixed inset-0 z-50 flex items-center justify-center",
    asideContainer: "fixed inset-0 z-50 flex items-stretch justify-end",
  },
  variants: {
    position: {
      right: {
        asideContent: "right-0",
        asideContainer: "justify-end",
      },
      left: {
        asideContent: "left-0",
        asideContainer: "justify-start",
      },
    },
  },
  defaultVariants: {
    position: "right",
  },
});

const {
  overlay,
  content,
  asideContent,
  titleVisible,
  titleHidden,
  closeButton,
  closeIcon,
  container,
  asideContainer,
} = styles();

// Animation variants for standard modal
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.15 },
  },
};

// Animation variants for aside modal
const asideVariantsRight = {
  hidden: {
    opacity: 0,
    x: "100%",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.2 },
  },
};

const asideVariantsLeft = {
  hidden: {
    opacity: 0,
    x: "-100%",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    x: "-100%",
    transition: { duration: 0.2 },
  },
};

interface ModalProps {
  children: React.ReactNode;
  modalType: ModalType;
  title: string;
  description: string;
  hideTitle?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  closeButtonClassName?: string;
  variant?: "default" | "aside";
  position?: "left" | "right";
}

export const Modal = ({
  children,
  modalType,
  title,
  hideTitle = true,
  className = "",
  overlayClassName = "",
  contentClassName = "",
  titleClassName = "",
  closeButtonClassName = "",
  description,
  variant = "default",
  position = "right",
}: ModalProps) => {
  const isOpen = useModalStore((state) => state.isModalOpen(modalType));
  const closeModal = useModalStore((state) => state.closeModal);

  const isAside = variant === "aside";
  const containerClass = isAside
    ? asideContainer({ position })
    : container({ className });
  const contentClass = isAside
    ? asideContent({ position, className: contentClassName })
    : content({ className: contentClassName });
  const animationVariants = isAside
    ? position === "right"
      ? asideVariantsRight
      : asideVariantsLeft
    : contentVariants;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && closeModal(modalType)}
    >
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className={overlay({ className: overlayClassName })}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
              />
            </Dialog.Overlay>

            <div className={containerClass}>
              <Dialog.Content asChild>
                <motion.div
                  className={contentClass}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={animationVariants}
                >
                  <Dialog.Title
                    className={
                      hideTitle
                        ? titleHidden()
                        : titleVisible({ className: titleClassName })
                    }
                  >
                    {title}
                  </Dialog.Title>
                  <VisuallyHidden.Root asChild>
                    <Dialog.Description>{description}</Dialog.Description>
                  </VisuallyHidden.Root>

                  <Dialog.Close
                    className={closeButton({
                      className: closeButtonClassName,
                    })}
                  >
                    <MdClose className={closeIcon()} />
                  </Dialog.Close>

                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

// Type-safe trigger component
interface ModalTriggerProps<T = Record<string, unknown>> {
  children: React.ReactNode;
  modalType: ModalType;
  modalProps?: T;
  className?: string;
  exclusive?: boolean; // Added option
  closeOthers?: boolean; // Added option
}

export const ModalTrigger = <
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  children,
  modalType,
  modalProps,
  className,
  exclusive = true, // Default to true
  closeOthers = false, // Default to false
}: ModalTriggerProps<T>) => {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div
      className={className}
      onClick={() => {
        openModal(modalType, modalProps, { exclusive, closeOthers });
      }}
    >
      {children}
    </div>
  );
};

// Close component for closing the current modal
interface ModalCloseProps {
  children: React.ReactNode;
  modalType: ModalType; // Add modalType to specify which modal to close
  className?: string;
}

export const ModalClose = ({
  children,
  modalType,
  className,
}: ModalCloseProps) => {
  const closeModal = useModalStore((state) => state.closeModal);

  return (
    <div className={className} onClick={() => closeModal(modalType)}>
      {children}
    </div>
  );
};

// Hook for accessing modal props with type safety
export function useModalProps<T = Record<string, unknown>>(
  modalType: ModalType,
): T | undefined {
  return useModalStore((state) => state.getModalProps<T>(modalType));
}

export default Modal;

/*
Usage example:

import { Modal, ModalTrigger, ModalClose } from "@/components/ui/Modal";

// In a component:
<ModalTrigger modalName="example-modal">
  <button>Open Modal</button>
</ModalTrigger>

// Modal component somewhere in your app
<Modal name="example-modal" title="Example Modal">
  <div className="p-6">
    Modal Content
    <ModalClose>
        Close Modal
    </ModalClose>
  </div>
</Modal>
*/
