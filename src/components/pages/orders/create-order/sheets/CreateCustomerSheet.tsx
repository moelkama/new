import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/ui/sheet";
import { Button } from "@/components/shadcn/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/ui/form";
import { UserIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import React from "react";
import { useCustomerStore } from "@/store/orders/createCustomerStore";
import {
  customerFormSchema,
  CustomerFormValues,
} from "@/schemas/orders/createCustomer";
import { BorderBottomInput } from "@/components/ui/BorderBottomInput";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/hooks/apis/useApi";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { toast } from "sonner";

interface CreateCustomerSheetProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateCustomerSheet: React.FC<CreateCustomerSheetProps> = ({
  onClose,
  isOpen,
}) => {
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const updateCustomerId = useCustomerStore((state) => state.updateCustomerId);

  const { fetchWithAuth } = useApi();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      first_name: "",
      customer_address: "",
      phone_number: "",
      customer_id: null,
    },
  });

  const { mutate: createCustomer, isPending } = useMutation({
    mutationFn: async (data: { first_name: string; phone_number: string }) => {
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.auth}/partner-create-user/`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
      return response;
    },
    onSuccess: (data) => {
      toast.success("Customer added successfully!");
      updateCustomerId(data.user_id);
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error adding customer:", error);
      toast.error("Error adding customer. Please try again.");
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    addCustomer(data);
    const transformedData = {
      first_name: data.first_name,
      phone_number: data.phone_number,
    };
    if (form.formState.errors) {
      console.log("creating customer:", transformedData);
      createCustomer(transformedData);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>User details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-6 pt-6"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F4F9F9]">
                    <UserIcon className="text-brand-main h-3 w-3" />
                  </div>
                  <div className="m-0 flex flex-1 flex-col p-0">
                    <FormLabel>CUSTOMER NAME</FormLabel>
                    <FormControl>
                      <BorderBottomInput {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_address"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F4F9F9]">
                    <MapPinIcon className="text-brand-main h-3 w-3" />
                  </div>
                  <div className="m-0 flex flex-1 flex-col p-0">
                    <FormLabel>ADDRESS</FormLabel>
                    <FormControl>
                      <BorderBottomInput {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="flex-col">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F4F9F9]">
                      <PhoneIcon className="text-brand-main h-3 w-3" />
                    </div>
                    <div className="m-0 flex flex-1 flex-col p-0">
                      <FormLabel>PHONE NUMBER</FormLabel>
                      <FormControl>
                        <BorderBottomInput {...field} />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage className="text-center text-xs font-light" />
                </FormItem>
              )}
            />

            <div className="mt-auto pb-6">
              <Button
                type="submit"
                className={`${isPending ? "bg-brand-main/50 cursor-not-allowed text-white/50" : "bg-brand-main hover:bg-brand-main w-full text-white"}`}
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add Articles"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCustomerSheet;
