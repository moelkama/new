import { STORE_KEYS } from "@/constants/store_keys";
import { CustomerFormValues } from "@/schemas/orders/createCustomer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerStore {
  customer: CustomerFormValues;
  addCustomer: (customer: CustomerFormValues) => void;

  updateCustomerId: (customerId: number) => void;
  removeCustomerFromLocalStorage: () => void;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      customer: {
        first_name: "",
        customer_address: "",
        phone_number: "",
        customer_id: null,
      },
      addCustomer: (customer) => set(() => ({ customer: customer })),

      updateCustomerId: (customerId) =>
        set((state) => ({
          customer: { ...state.customer, customer_id: customerId },
        })),

      removeCustomerFromLocalStorage: () => {
        set(() => ({
          customer: {
            first_name: "",
            customer_address: "",
            phone_number: "",
            customer_id: null,
          },
        }));
        localStorage.removeItem(STORE_KEYS.CustomerInfo);
      },
    }),
    {
      name: `${STORE_KEYS.CustomerInfo}`,
    },
  ),
);
