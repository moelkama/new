"use client";
import { JSX, useEffect, useState } from "react";
import Collapsible, { CollapsibleGroup } from "@/components/ui/Collapsible";
import Icon from "@/components/ui/Icon";
import InputField from "@/components/ui/InputField";
import Modal, { useModalProps } from "@/components/ui/Modal";
import { FiMail, FiUser } from "react-icons/fi";
import { MdPhone } from "react-icons/md";
import { tv } from "tailwind-variants";
import {
  Restaurant,
  useOperationContact,
  useUpdateOperationContact,
  useBusinessContact,
  useUpdateBusinessContact,
  OperationContact,
} from "@/hooks/apis/useRestaurants";
import ScheduleAndHolidays from "@/app/(platform)/settings/_components/ScheduleAndHolidays";

interface StoreSettingsModalProps {
  restaurant: Restaurant;
}

const contactFieldMapping = {
  full_name: {
    label: "Full Name",
    type: "text",
    icon: <FiUser />,
  },
  surname: {
    label: "Surname",
    type: "text",
    icon: <FiUser />,
  },
  primary_email: {
    label: "Primary email address",
    type: "email",
    icon: <FiMail />,
  },
  secondary_email: {
    label: "Secondary email address",
    type: "email",
    icon: <FiMail />,
  },
  phone_number: {
    label: "Mobile phone number",
    type: "tel",
    icon: <MdPhone />,
  },
  whatsapp_number: {
    label: "WhatsApp number",
    type: "tel",
    icon: <MdPhone />,
  },
};

const { modal } = tv({
  slots: {
    modal: "max-w-[649px]",
  },
})();

const initialContactState = {
  full_name: "",
  surname: "",
  primary_email: "",
  secondary_email: "",
  phone_number: "",
  whatsapp_number: "",
};

const StoreSettingsModal = () => {
  const modalType = "store_settings_modal";
  const props = useModalProps<StoreSettingsModalProps>(modalType);
  const restaurantId = props?.restaurant.id ?? 0;

  const [operationContact, setOperationContact] = useState(initialContactState);
  const [originalOperationContact, setOriginalOperationContact] = useState(initialContactState);
  const [operationSavingFields, setOperationSavingFields] = useState<Record<string, boolean>>({});

  const [businessContact, setBusinessContact] = useState(initialContactState);
  const [originalBusinessContact, setOriginalBusinessContact] = useState(initialContactState);
  const [businessSavingFields, setBusinessSavingFields] = useState<Record<string, boolean>>({});

  const {
    data: operationContactData,
    isLoading: isOperationContactLoading,
    isError: isOperationContactError,
  } = useOperationContact(restaurantId);
  const updateOperationContact = useUpdateOperationContact(restaurantId);

  const {
    data: businessContactData,
    isLoading: isBusinessContactLoading,
    isError: isBusinessContactError,
  } = useBusinessContact(restaurantId);
  const updateBusinessContact = useUpdateBusinessContact(restaurantId);

  useEffect(() => {
    if (operationContactData) {
      const mappedData: OperationContact = {
        full_name: operationContactData.full_name ?? "",
        surname: operationContactData.surname ?? "",
        primary_email: operationContactData.primary_email ?? "",
        secondary_email: operationContactData.secondary_email ?? "",
        phone_number: operationContactData.phone_number ?? "",
        whatsapp_number: operationContactData.whatsapp_number ?? "",
      };

      setOperationContact(mappedData);
      setOriginalOperationContact(mappedData);
    }
  }, [operationContactData]);

  useEffect(() => {
    if (businessContactData) {
      setBusinessContact(businessContactData);
      setOriginalBusinessContact(businessContactData);
    }
  }, [businessContactData]);

  const handleContactChange = (
    setState: React.Dispatch<React.SetStateAction<typeof initialContactState>>,
    key: string,
    value: string
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  interface ContactMutation<T> {
    mutateAsync: (data: Partial<T>) => Promise<T>;
    isPending: boolean;
  }
  const handleContactSave = async (
    key: string,
    currentValue: string,
    originalValue: string,
    setSaving: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    setOriginal: React.Dispatch<React.SetStateAction<typeof initialContactState>>,
    setCurrent: React.Dispatch<React.SetStateAction<typeof initialContactState>>,
    mutate: ContactMutation<typeof initialContactState>
  ) => {
    if (currentValue === originalValue) return;

    try {
      setSaving(prev => ({ ...prev, [key]: true }));
      await mutate.mutateAsync({ [key]: currentValue });
      setOriginal(prev => ({ ...prev, [key]: currentValue }));
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      setCurrent(prev => ({ ...prev, [key]: originalValue }));
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const renderContactSection = (
    title: string,
    id: string,
    icon: JSX.Element,
    contactData: typeof initialContactState,
    originalContactData: typeof initialContactState,
    savingFields: Record<string, boolean>,
    isLoading: boolean,
    isError: boolean,
    handleChange: (key: string, value: string) => void,
    handleSave: (key: string) => void
  ) => (
    <Collapsible
      title={title}
      id={id}
      icon={<Icon as={() => icon} wrapperVariant="primary" iconSize="lg" />}
      triggerTextClassName="uppercase !text-[12px] font-medium tracking-[1px]"
      triggerClassName="p-0 pb-5"
    >
      <div className="mt-10 flex flex-wrap justify-between gap-8">
        {isLoading && <div className="w-full text-center">Loading {title.toLowerCase()} details...</div>}
        {isError && <div className="w-full text-center text-red-500">Failed to load {title.toLowerCase()} details.</div>}

        {Object.entries(contactFieldMapping).map(([key, field]) => (
          <InputField
            key={`${id}-${key}`}
            className="w-full md:w-[45%]"
            size="sm"
            variant="secondary"
            label={field.label}
            type={field.type}
            icon={field.icon}
            value={contactData[key as keyof typeof contactData] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={() => handleSave(key)}
            disabled={isLoading || savingFields[key]}
          />
        ))}
      </div>
    </Collapsible>
  );

  return (
    <Modal
      modalType="store_settings_modal"
      title="Store Settings"
      description="Store settings"
      contentClassName={modal()}
      hideTitle={false}
    >
      <ScheduleAndHolidays restaurantId={restaurantId} />
      <CollapsibleGroup>
        {renderContactSection(
          "Operations Contact",
          "operations",
          <FiMail />,
          operationContact,
          originalOperationContact,
          operationSavingFields,
          isOperationContactLoading,
          isOperationContactError,
          (key, value) => handleContactChange(setOperationContact, key, value),
          (key) => handleContactSave(
            key,
            operationContact[key as keyof typeof operationContact],
            originalOperationContact[key as keyof typeof originalOperationContact],
            setOperationSavingFields,
            setOriginalOperationContact,
            setOperationContact,
            updateOperationContact
          )
        )}

        {renderContactSection(
          "Business Contact",
          "business",
          <MdPhone />,
          businessContact,
          originalBusinessContact,
          businessSavingFields,
          isBusinessContactLoading,
          isBusinessContactError,
          (key, value) => handleContactChange(setBusinessContact, key, value),
          (key) => handleContactSave(
            key,
            businessContact[key as keyof typeof businessContact],
            originalBusinessContact[key as keyof typeof originalBusinessContact],
            setBusinessSavingFields,
            setOriginalBusinessContact,
            setBusinessContact,
            updateBusinessContact
          )
        )}
      </CollapsibleGroup>
    </Modal>
  );
};

export default StoreSettingsModal;