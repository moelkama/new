import { create } from "zustand";

// Define all modal types in your application
export type ModalType =
  | "edit_login_details"
  | "edit_business_contact_info"
  | "forget_password"
  | "store_settings_modal"
  | "report_problem_modal"
  | "reset_password_modal"
  | "create_section_modal"
  | "edit_meal_modal"
  | "create_meal_modal"
  | "support_modal";

// Define modal data structure
interface ModalData {
  props?: Record<string, unknown>;
  hidden?: boolean;
}

// Each modal entry
interface ModalEntry extends ModalData {
  isOpen: boolean;
}

// Define the full state shape
interface ModalState {
  // Track multiple modals with their state
  modals: Record<ModalType, ModalEntry>;
  // Track the modal stack for nesting
  modalStack: ModalType[];

  // Actions
  openModal: (
    modal: ModalType,
    props?: Record<string, unknown>,
    options?: { exclusive?: boolean; closeOthers?: boolean },
  ) => void;
  closeModal: (modal: ModalType) => void;
  closeAllModals: () => void;
  updateModalProps: (modal: ModalType, props: Record<string, unknown>) => void;

  // Selectors
  isModalOpen: (modal: ModalType) => boolean;
  getModalProps: <T = Record<string, unknown>>(
    modal: ModalType,
  ) => T | undefined;
  getTopModal: () => ModalType | undefined;
}

// Create initial state dynamically
const createInitialState = () => {
  const modals: Record<string, ModalEntry> = {};

  const modalTypes: ModalType[] = [
    "edit_login_details",
    "edit_business_contact_info",
    "forget_password",
    "store_settings_modal",
    "report_problem_modal",
    "support_modal",
    "reset_password_modal",
    "create_section_modal",
    "edit_meal_modal",
    "create_meal_modal",
  ];

  modalTypes.forEach((type) => {
    modals[type] = { isOpen: false };
  });

  return { modals, modalStack: [] };
};

export const useModalStore = create<ModalState>((set, get) => ({
  // Initial state
  ...createInitialState(),

  // Actions
  openModal: (
    modal,
    props,
    options = { exclusive: true, closeOthers: false },
  ) =>
    set((state) => {
      const newState = { ...state };
      const { exclusive = true, closeOthers = false } = options;
      const newStack = [...state.modalStack];

      if (closeOthers) {
        // Close all other modals
        Object.keys(newState.modals).forEach((key) => {
          if (key !== modal) {
            newState.modals[key as ModalType] = {
              ...newState.modals[key as ModalType],
              isOpen: false,
              hidden: false,
            };
          }
        });
        // Reset modal stack
        newStack.length = 0;
      } else if (exclusive) {
        // Hide all currently visible modals
        Object.keys(newState.modals).forEach((key) => {
          if (
            key !== modal &&
            newState.modals[key as ModalType].isOpen &&
            !newState.modals[key as ModalType].hidden
          ) {
            newState.modals[key as ModalType] = {
              ...newState.modals[key as ModalType],
              hidden: true,
            };
          }
        });
      }

      // Open the requested modal
      newState.modals[modal] = {
        ...newState.modals[modal],
        isOpen: true,
        props,
        hidden: false,
      };

      // Add this modal to the stack if it's not already the top modal
      if (newStack[newStack.length - 1] !== modal) {
        // If modal is already in stack, remove it first to avoid duplication
        const existingIndex = newStack.indexOf(modal);
        if (existingIndex !== -1) {
          newStack.splice(existingIndex, 1);
        }
        newStack.push(modal);
      }

      return { ...newState, modalStack: newStack };
    }),

  closeModal: (modal) =>
    set((state) => {
      const newState = { ...state };
      const newStack = [...state.modalStack];

      // Close the modal
      newState.modals[modal] = {
        ...newState.modals[modal],
        isOpen: false,
        hidden: false,
      };

      // Remove this modal from the stack
      const modalIndex = newStack.indexOf(modal);
      if (modalIndex !== -1) {
        newStack.splice(modalIndex, 1);
      }

      // If there are still modals in the stack, show the top one
      if (newStack.length > 0) {
        const topModal = newStack[newStack.length - 1];
        newState.modals[topModal] = {
          ...newState.modals[topModal],
          hidden: false,
        };
      }

      return { ...newState, modalStack: newStack };
    }),

  closeAllModals: () =>
    set((state) => {
      const updatedModals = { ...state.modals };

      Object.keys(updatedModals).forEach((modal) => {
        updatedModals[modal as ModalType] = {
          ...updatedModals[modal as ModalType],
          isOpen: false,
          hidden: false,
        };
      });

      return { modals: updatedModals, modalStack: [] };
    }),

  updateModalProps: (modal, props) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: {
          ...state.modals[modal],
          props: { ...state.modals[modal].props, ...props },
        },
      },
    })),

  // Selectors
  isModalOpen: (modal) => {
    const modalState = get().modals[modal];
    const isTopModal = get().modalStack[get().modalStack.length - 1] === modal;

    // A modal is considered "open" (visible) if:
    // 1. It's marked as open AND
    // 2. It's either not hidden OR it's the top modal in the stack
    return Boolean(modalState?.isOpen && (!modalState?.hidden || isTopModal));
  },

  getModalProps: <T>(modal: ModalType): T | undefined => {
    const props = get().modals[modal]?.props;
    return props as T | undefined;
  },

  getTopModal: () => {
    const stack = get().modalStack;
    return stack.length > 0 ? stack[stack.length - 1] : undefined;
  },
}));
