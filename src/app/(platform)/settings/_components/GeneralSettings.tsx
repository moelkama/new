import BusinessProfile from "./BusinessProfile";
import StoreSettings from "./StoreSettings";
import { FiUser, FiSettings } from "react-icons/fi";
import Collapsible, { CollapsibleGroup } from "@/components/ui/Collapsible";
import { tv } from "tailwind-variants";
import { ReactNode } from "react";
import { ModalType } from "@/store/modal-store";

const styles = tv({
  slots: {
    subtitle: "text-dark-3 text-body-normal mt-6 ml-4",
    section: "",
    content: "@container p-3",
  },
});

const { subtitle, section, content } = styles();


interface SettingItem {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  modal_id?: ModalType;
}

const generalSettingsData: SettingItem[] = [
  {
    id: "business-profile",
    title: "Business Profile",
    icon: <FiUser />,
    content: <BusinessProfile className={content()} />,
  },
  {
    id: "store-settings",
    title: "Store Settings",
    icon: <FiSettings />,
    content: <StoreSettings className={content()} />,
  },
];

// GeneralSettings Component
function GeneralSettings() {
  return (
    <section className={section()}>
      <p className={subtitle()}>General</p>
      <CollapsibleGroup>
        {generalSettingsData.map((item) => (
          <Collapsible
            key={item.id}
            id={item.id}
            title={item.title}
            icon={item.icon}>
            {item.content}
          </Collapsible>
        ))}
      </CollapsibleGroup>
    </section>
  );
}

export default GeneralSettings;
