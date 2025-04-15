import Icon from "@/components/ui/Icon";
import { MdPhone } from "react-icons/md";
import { tv } from "tailwind-variants";
import { FiSend } from "react-icons/fi";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

const styles = tv({
  slots: {
    heading: "text-heading-3 mb-13 font-medium",
    methodsContainer: "mb-8",
    methodItem: "flex items-center justify-between gap-2",
    methodIcon: "",
    methodLabel: "text-body-small font-medium tracking-[1px] uppercase",
    actionIcon: "",
  },
});

const { heading, methodsContainer, methodItem, methodIcon, methodLabel } =
  styles();

interface SupportModalProps {
  className?: string;
}

const contactMethods = [
  { title: "whatsapp", icon: MdPhone, link: "https://wa.me/212697779232" },
];

const SupportModal: React.FC<SupportModalProps> = ({}) => {
  return (
    <Modal
      hideTitle
      modalType="support_modal"
      description="Support"
      title="Support"
      contentClassName="max-w-[687px] px-8"
    >
      <h2 className={heading()}>Support</h2>
      <div className={methodsContainer()}>
        {contactMethods.map((method) => (
          <Link
            href={method.link}
            key={method.title}
            className={methodItem()}
            target="_blank"
          >
            <div className="flex items-center gap-4">
              <Icon
                as={method.icon}
                className={methodIcon()}
                wrapperSize="md"
                iconSize="lg"
                wrapperVariant="primary"
              />
              <span className={methodLabel()}>{method.title}</span>
            </div>
            <FiSend className="text-brand-main size-6" />
          </Link>
        ))}
      </div>
    </Modal>
  );
};

export default SupportModal;
