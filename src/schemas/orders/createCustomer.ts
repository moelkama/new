import { z } from "zod";

export const customerFormSchema = z.object({
  first_name: z.string().min(1, "Customer name is required"),
  customer_address: z.string().min(1, "Address is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+212[5-7][0-9]{8}$/,
      "Phone number must start with +212 and contain 9 digits",
    ),
  customer_id: z.number().nullable(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
