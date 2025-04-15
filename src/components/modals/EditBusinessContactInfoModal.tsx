"use client";

import { useEffect, useState } from "react";
import { Modal, useModalProps } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { FiMail, FiPhone } from "react-icons/fi";
import InputField from "@/components/ui/InputField";
import Checkbox from "@/components/ui/CheckBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useModalActions from "@/hooks/useModalActions";
import { tv } from "tailwind-variants";
import Image from "next/image";
import { UserData, useUpdateUser } from "@/hooks/apis/useUserData";

interface EditBusinessContactProps {
  userData?: UserData;
  userId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  businessLogo?: string;
}

// Define the validation schema
const businessContactSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone1: z
    .string({ required_error: "Phone number is required" })
    .min(1, "Phone number is required"),
  phone2: z.string().optional(),
  agreement: z.boolean().optional(),
});

type BusinessContactInputs = z.infer<typeof businessContactSchema>;

const styles = tv({
  slots: {
    modal: "max-w-[650px] p-8",
    subtitle: "text-dark-3 mt-5 mb-5 text-[14px]",
    form: "flex flex-col gap-6",
    fieldGroup: "mt-8 flex gap-2",
    field: "",
    label: "mb-2 text-[12px] text-black",
    uploadSection: "flex items-end gap-8",
    imageContainer: "",
    imageStyles: "border-brand-main rounded-full border-5",
    buttonGroup: "mb-4 flex gap-4",
    uploadButton: "px-17 py-3 font-semibold",
    deleteButton: "px-17 py-3 font-semibold",
    checkboxContainer: "mb-5 flex items-center gap-4",
    checkbox: "rounded-[2px]",
    checkboxLabel: "text-dark-3 text-[10px]",
    submitButton: "mx-auto mt-5 max-w-[336px]",
    forgetPasswordLink: "text-brand-main w-fit cursor-pointer text-[12px]",
  },
});

const {
  modal,
  subtitle,
  form,
  fieldGroup,
  field,
  label,
  uploadSection,
  imageContainer,
  buttonGroup,
  uploadButton,
  deleteButton,
  checkboxContainer,
  checkbox,
  checkboxLabel,
  submitButton,
} = styles();

const EditBusinessContactInfoModal = () => {
  const modalType = "edit_business_contact_info";
  const props = useModalProps<EditBusinessContactProps>(modalType);

  // Get the update mutation
  const { updateProfileDetails } = useUpdateUser();
  const {
    mutate,
    isPending: isSubmitting,
    isError,
    error,
    isSuccess,
  } = updateProfileDetails;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { close: closeModal } = useModalActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
    setValue,
  } = useForm<BusinessContactInputs>({
    resolver: zodResolver(businessContactSchema),
    mode: "onBlur",
    defaultValues: {
      email: props?.email || "",
      firstName: props?.firstName || "",
      lastName: props?.lastName || "",
      phone1: props?.phoneNumber || "",
      phone2: "",
      agreement: false,
    },
  });

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle logo deletion
  const handleDeleteLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    // If there's a file input reference, reset its value
    const fileInput = document.getElementById(
      "logo-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Update form when props change
  useEffect(() => {
    if (props) {
      if (props.email) setValue("email", props.email);
      if (props.firstName) setValue("firstName", props.firstName);
      if (props.lastName) setValue("lastName", props.lastName);
      if (props.phoneNumber) setValue("phone1", props.phoneNumber);
    }
  }, [props, setValue]);

  useEffect(() => {
    if (isSuccess) {
      closeModal(modalType);
    }
  }, [isSuccess, closeModal, modalType]);

  const onSubmit = async (data: BusinessContactInputs) => {
    const hasChanges =
      data.email !== props?.email ||
      data.firstName !== props?.firstName ||
      data.lastName !== props?.lastName ||
      data.phone1 !== props?.phoneNumber ||
      !!logoFile; // Logo change counts as a change

    if (!hasChanges) {
      closeModal(modalType);
      return;
    }

    mutate({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phone1,
    });

    if (logoFile) {
      console.log("Logo file to upload:", logoFile);
    }
  };

  return (
    <Modal
      modalType={modalType}
      title="Edit Business Contact Information"
      hideTitle={false}
      contentClassName={modal()}
      description="Get updates about your performance, new features, and regulations."
    >
      <form onSubmit={handleSubmit(onSubmit)} className={form()} noValidate>
        <div>
          <h3 className={subtitle()}>Upload your business logo mark</h3>
          <div className={uploadSection()}>
            <div className={imageContainer()}>
              {/* <Avatar
              src={logoPreview || props?.businessLogo || ""}
              alt="Business Logo"
              size="lg"
              fallbackText="RB"
              color="blue"
            /> */}
              <div className="border-brand-main relative h-[88px] w-[88px] overflow-hidden rounded-full border-4">
                <Image
                  src={
                    logoPreview ||
                    props?.businessLogo ||
                    "https://placecats.com/300/300"
                  }
                  alt="Business Logo"
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              </div>
            </div>
            <div className={buttonGroup()}>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: "none" }}
              />
              <Button
                size="md"
                variant="primary"
                type="button"
                className={uploadButton()}
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                Upload
              </Button>
              <Button
                size="md"
                variant="secondary"
                type="button"
                className={deleteButton()}
                onClick={handleDeleteLogo}
                disabled={!logoPreview && !props?.businessLogo}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className={subtitle()}>Profile details</h3>
          <InputField
            size="sm"
            className={field()}
            labelClassName={label()}
            label="Email address"
            type="email"
            placeholder="Email address"
            icon={<FiMail />}
            error={errors.email}
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          <div className={fieldGroup()}>
            <InputField
              size="sm"
              className={field()}
              labelClassName={label()}
              label="Phone Number 1"
              type="tel"
              placeholder="Phone Number"
              icon={<FiPhone />}
              error={errors.phone1}
              aria-invalid={errors.phone1 ? "true" : "false"}
              {...register("phone1")}
            />
            <InputField
              size="sm"
              className={field()}
              labelClassName={label()}
              label="Phone Number 2/WhatsApp"
              type="tel"
              placeholder="Phone Number"
              icon={<FiPhone />}
              error={errors.phone2}
              aria-invalid={errors.phone2 ? "true" : "false"}
              {...register("phone2")}
            />
          </div>
        </div>

        <div className={checkboxContainer()}>
          <Checkbox
            id="business-agreement"
            className={checkbox()}
            {...register("agreement")}
          />
          <label htmlFor="business-agreement" className={checkboxLabel()}>
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
          size="lg"
          variant="primary"
          className={submitButton()}
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Modal>
  );
};

export default EditBusinessContactInfoModal;

// Future React Query Migration
// When you're ready to implement React Query, you'll replace:

// 1 - The fetchBusinessData function with a useQuery hook:
// const {
// 	data: businessData,
// 	isLoading,
// 	error
//   } = useQuery('businessContactInfo', fetchBusinessData);

// 2 - The updateBusinessData function with a useMutation hook:

// const {
// 	mutate: updateBusiness,
// 	isLoading: isSubmitting,
// 	error: submitError
//   } = useMutation(updateBusinessData, {
// 	onSuccess: () => {
// 	  queryClient.invalidateQueries('businessContactInfo');
// 	  closeModal(modalType);
// 	}
//   });

//   3 -The logo upload functionality could be a separate mutation or part of the same mutation:
//   const { mutate: uploadLogo } = useMutation(uploadLogoFile);
