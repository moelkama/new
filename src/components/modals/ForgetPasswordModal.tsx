"use client";

import { useState, useEffect } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { tv } from "tailwind-variants";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useModalStore } from "@/store/modal-store";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import { sendPasswordResetLink } from "@/app/utils/authUtils";




// Define the validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

const styles = tv({
  slots: {
    modal: "max-w-[649px] px-10 py-8",
    subtitle: "text-dark-3 mt-12 mb-8 text-base",
    form: "flex max-w-xs flex-col gap-8",
    fieldGroup: "flex max-w-sm flex-col gap-8",
    field: "",
    label: "mb-2 text-[12px] text-black",
    submitButton: "",
    successContainer: "flex flex-col items-center py-8",
    successIcon: "",
    successTitle: "mx-auto mt-10 max-w-[350px] text-center text-xl font-medium",
  },
});

const {
  modal,
  subtitle,
  form,
  field,
  label,
  submitButton,
  successContainer,
  successIcon,
  successTitle,
} = styles();

const ForgetPasswordModal = () => {
  const modalType = "forget_password";
  //   const props = useModalProps<ForgetPasswordModalProps>(modalType);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Check if modal is open
  const isOpen = useModalStore((state) => state.isModalOpen(modalType));

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setSubmittedEmail("");
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur", // Validate fields on blur
    criteriaMode: "all", // Show all validation errors
    defaultValues: {
      email: "",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ForgotPasswordInputs) => {
    try {
      const result = await sendPasswordResetLink(data.email);

      if (result.success) {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        console.log("Password reset link sent to:", data.email);
      } else {
        console.error("Failed to send reset link:", result.error);
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
    }
  };

  return (
    <Modal
      modalType={modalType}
      title={isSubmitted ? "Request Sent" : "Forgot Password"}
      hideTitle={false}
      contentClassName={modal()}
      description="Reset your password by entering your email address."
    >
      {!isSubmitted ? (
        <>
          <h2 className={subtitle()}>Enter Your Email</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={form()} noValidate>
            <InputField
              className={field()}
              labelClassName={label()}
              label="EMAIL ADDRESS"
              type="email"
              icon={<FiMail />}
              placeholder="your@email.com"
              error={errors.email}
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email")}
            />
            <Button
              type="submit"
              size="lg"
              className={submitButton()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "SENDING..." : "CONFIRM"}
            </Button>
          </form>
        </>
      ) : (
        <div className={successContainer()}>
          <Icon
            as={FiCheckCircle}
            iconSize="xl"
            wrapperSize="xl"
            wrapperVariant="primary"
            className={successIcon()}
          />
          <h2 className={successTitle()}>
            Please check your email to reset your password
          </h2>
        </div>
      )}
    </Modal>
  );
};

export default ForgetPasswordModal;
