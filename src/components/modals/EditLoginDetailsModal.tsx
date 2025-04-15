"use client";
import { Modal, ModalTrigger, useModalProps } from "@/components/ui/Modal";
import { FiKey, FiMail } from "react-icons/fi";
import { tv } from "tailwind-variants";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useModalActions from "@/hooks/useModalActions";
import Checkbox from "../ui/CheckBox";
import { UserData, useUpdateUser } from "@/hooks/apis/useUserData";
import { useEffect } from "react";

interface EditLoginDetailsProps {
  userData?: UserData;
  userId?: number;
  email?: string;
}

const editLoginSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .trim(),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(1, "Confirm password is required"),
    agreement: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginDetailsInputs = z.infer<typeof editLoginSchema>;

const styles = tv({
  slots: {
    modal: "max-w-[650px] px-11 py-8",
    subtitle: "text-dark-3 mt-10 mb-8 text-base",
    form: "flex flex-col gap-6",
    fieldGroup: "flex max-w-sm flex-col gap-4",
    field: "",
    label: "mb-2 text-[11px] text-black",
    input: "pb-2 !text-[12px]",
    forgetPasswordLink: "text-brand-main w-fit cursor-pointer text-[12px]",
    checkboxContainer: "flex items-center gap-4",
    checkbox: "rounded-[2px]",
    checkboxLabel: "text-dark-3 text-[10px]",
    submitButton: "mt-15 self-center md:w-[336px]",
  },
});

const {
  modal,
  subtitle,
  input,
  fieldGroup,
  form,
  field,
  label,
  forgetPasswordLink,
  checkboxContainer,
  checkbox,
  checkboxLabel,
  submitButton,
} = styles();

const EditLoginDetailsModal = () => {
  const modalType = "edit_login_details";
  // Get props from the store
  const props = useModalProps<EditLoginDetailsProps>(modalType);

  // Get the mutation hook
  const { updateLoginDetails } = useUpdateUser();
  const { mutate, isPending, isError, error, isSuccess } = updateLoginDetails;

  // Set default email from props
  const defaultEmail = props?.email || props?.userData?.email || "";

  const { close: closeModal } = useModalActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LoginDetailsInputs>({
    resolver: zodResolver(editLoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: defaultEmail,
      password: "",
      confirmPassword: "",
      agreement: false,
    },
  });

  // Update form when props change
  useEffect(() => {
    if (props?.email || props?.userData?.email) {
      setValue("email", props?.email || props?.userData?.email || "");
    }
  }, [props, setValue]);

  // Close modal on successful update
  useEffect(() => {
    if (isSuccess) {
      closeModal(modalType);
      reset();
    }
  }, [isSuccess, closeModal, reset, modalType]);

  const onSubmit = async (data: LoginDetailsInputs) => {
    // Call the mutation function
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Modal
      description="This is the email you use to log in in the Manager Portal."
      modalType={modalType}
      title="Login Details"
      hideTitle={false}
      contentClassName={modal()}
      titleClassName="text-2xl "
    >
      <h2 className={subtitle()}>Profile details</h2>
      <form className={form()} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={fieldGroup()}>
          <InputField
            className={field()}
            labelClassName={label()}
            inputClassName={input()}
            label="EMAIL ADDRESS"
            type="email"
            icon={<FiMail />}
            placeholder="Enter your email"
            error={errors.email}
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
            disabled
          />

          <InputField
            className={field()}
            labelClassName={label()}
            inputClassName={input()}
            label="PASSWORD"
            icon={<FiKey />}
            type="password"
            placeholder="Enter your password"
            error={errors.password}
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
          />

          <InputField
            className={field()}
            labelClassName={label()}
            inputClassName={input()}
            label="CONFIRM PASSWORD"
            icon={<FiKey />}
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            {...register("confirmPassword")}
          />
        </div>
        <ModalTrigger
          modalType="forget_password"
          className={forgetPasswordLink()}
        >
          Forget Password ?
        </ModalTrigger>

        <div className={checkboxContainer()}>
          <Checkbox
            id="agreement"
            className={checkbox()}
            {...register("agreement")}
          />
          <label htmlFor="agreement" className={checkboxLabel()}>
            I agree to receive updates from Ringoo via WhatsApp or similar
            platforms
          </label>
        </div>

        {isError && (
          <div className="mt-2 text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "An error occurred while updating your profile."}
          </div>
        )}

        <Button
          type="submit"
          className={submitButton()}
          size="lg"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Modal>
  );
};

export default EditLoginDetailsModal;
