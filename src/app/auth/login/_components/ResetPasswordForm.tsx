"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiMail } from "react-icons/fi";
import { tv } from "tailwind-variants";
import useModalActions from "@hooks/useModalActions";
import InputField from "@ui/InputField";
import Button from "@ui/Button";
import { useState } from "react";
import { sendPasswordResetLink } from "@/app/utils/authUtils";

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const styles = tv({
  slots: {
    form: "w-full flex-col items-center justify-between space-y-10",
    field: "",
    button: "",
    error: "mt-2 text-center text-sm text-red-500",
  },
});

const { form, field, button, error } = styles();

type ResetFormInputs = z.infer<typeof resetSchema>;
interface ResetFormProps {
  className?: string;
}

const ResetPasswordForm: React.FC<ResetFormProps> = ({ className }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
  });

  const { open: openModal } = useModalActions();

  const onSubmit = async () => {
    setApiError(null);
    try {
      const email = getValues("email");
      const result = await sendPasswordResetLink(email);

      if (result.success) {
        // Show success modal
        openModal("reset_password_modal", { email });
        console.log("Password reset link sent to:", email);
      } else {
        setApiError(result.error || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Submission failed", error);
      setApiError("An unexpected error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${form()} ${className}`}
      noValidate
    >
      <InputField
        className={field()}
        label="EMAIL ADDRESS"
        type="email"
        icon={<FiMail size={24} />}
        error={errors.email}
        placeholder="Enter your email"
        {...register("email")}
      />

      {apiError && <div className={error()}>{apiError}</div>}

      <Button
        size="lg"
        type="submit"
        disabled={isSubmitting}
        className={button()}
        variant="primary"
        fullWidth
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
