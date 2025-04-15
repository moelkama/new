"use client";

import { tv } from "tailwind-variants";
import { ModalTrigger } from "../Modal";
import { ModalType } from "@/store/modal-store";
import { UserData } from "@/hooks/apis/useUserData";

interface FieldProps {
  label: string;
  value: string;
  badge?: {
    text: string;
    active: boolean;
  };
}

interface BadgeProps {
  text: string;
  active: boolean;
  className?: string;
}

interface EditProfileSettingsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  fields: FieldProps[];
  userData?: UserData;
}
const badgeStyles = tv({
  base: "rounded-[4px] border-1 px-3 py-0.5 text-center text-[10px] font-medium uppercase",
  variants: {
    active: {
      true: "border-brand-main text-brand-main",
      false: "border-[#AACCCE] text-[#737373]",
    },
  },
  defaultVariants: {
    active: false,
  },
});

const styles = tv({
  slots: {
    card: "rounded-xl border-1 border-[#AACCCE] px-6 py-12",

    header: "flex items-center justify-between font-medium",
    title: "mb-2 text-lg text-[#262626]",
    editButton:
      "text-brand-main hover:text-brand-main/80 cursor-pointer text-sm font-medium uppercase",

    description: "text-[11px] font-medium text-[#737373]",

    fieldsContainer: "mt-8 flex flex-col justify-between gap-5 sm:flex-row",

    fieldItem:
      "flex w-full flex-wrap items-start justify-between gap-0.5 rounded-lg",
    fieldContent: "space-y-1",
    fieldLabel: "text-xs font-medium text-[#737373]",
    fieldValue: "text-xs font-medium text-[#262626]",
  },
});

const {
  card,
  header,
  title,
  editButton,
  description,
  fieldsContainer,
  fieldItem,
  fieldContent,
  fieldLabel,
  fieldValue,
} = styles();
const EditProfileSettingsCard: React.FC<EditProfileSettingsCardProps> = ({
  title: titleText,
  description: descriptionText,
  fields,
  className = "",
  userData, // Get user data
}) => {
  // Determine which modal to open based on the title
  const getModalType = (): ModalType => {
    if (titleText === "Login details") return "edit_login_details";
    if (titleText === "Business contact details")
      return "edit_business_contact_info";
    return "edit_login_details"; // Default fallback
  };

  return (
    <div className={card({ className })}>
      <div className={header()}>
        <h1 className={title()}>{titleText}</h1>
        <ModalTrigger
          modalType={getModalType()}
          modalProps={{
            // Pass actual user data to modal
            userData,
            userId: userData?.id,
            email: userData?.email,
            firstName: userData?.first_name,
            lastName: userData?.last_name,
            phoneNumber: userData?.phone_number,
          }}
        >
          <span className={editButton()}>Edit</span>
        </ModalTrigger>
      </div>

      <p className={description()}>{descriptionText}</p>

      <div className={fieldsContainer()}>
        {fields.map((field) => (
          <div key={field.label} className={fieldItem()}>
            <div className={fieldContent()}>
              <p className={fieldLabel()}>{field.label}</p>
              <p className={fieldValue()}>{field.value}</p>
            </div>

            {field.badge && (
              <Badge text={field.badge.text} active={field.badge.active} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Badge: React.FC<BadgeProps> = ({ text, active, className }) => {
  return <span className={badgeStyles({ active, className })}>{text}</span>;
};

export default EditProfileSettingsCard;
