"use client";

import Support from "./SupportModal";
import ReportProblem from "./ReportProblemModal";
import { FiHelpCircle, FiPaperclip, FiChevronRight } from "react-icons/fi";
import { tv } from "tailwind-variants";
import { ModalTrigger } from "@/components/ui/Modal";
import { ReactNode } from "react";
import { ModalType } from "@/store/modal-store";


interface SettingItem {
  id: string;
  title: string;
  icon: ReactNode;
  openable: boolean;
  content: ReactNode;
  modal_id?: ModalType;
}

const styles = tv({
  slots: {
    subtitle: "text-dark-3 text-body-normal mt-10 ml-4",
    section: "mb-8",
    content: "",
    trigger:
      "border-dark-2/29 mt-4 flex cursor-pointer items-center justify-between gap-2 rounded border-b p-4 transition-colors hover:bg-gray-50",
    triggerIcon: "text-brand-main text-[24px]",
    triggerText: "text-body-normal font-medium",
    triggerChevronIcon: "text-dark-2",
    contentArea: "flex items-center gap-6",
  },
});

const {
  subtitle,
  section,
  content,
  trigger,
  triggerIcon,
  triggerText,
  triggerChevronIcon,
  contentArea,
} = styles();

function SettingTrigger({
  title,
  icon,
}: {
  readonly title: string;
  readonly icon: React.ReactNode;
}) {
  return (
    <div className={trigger()} role="button" tabIndex={0}>
      <div className={contentArea()}>
        {icon && <span className={triggerIcon()}>{icon}</span>}
        <span className={triggerText()}>{title}</span>
      </div>
      <FiChevronRight className={triggerChevronIcon()} />
    </div>
  );
}

const otherSettingsData: SettingItem[] = [
  {
    id: "support",
    modal_id: "support_modal",
    title: "Support",
    icon: <FiHelpCircle />,
    openable: false,
    content: <Support />,
  },
  {
    id: "report_problem",
    title: "Report a Problem (Technical / Order Issues)",
    icon: <FiPaperclip />,
    openable: false,
    content: <ReportProblem className={content()} />,
    modal_id: "report_problem_modal",
  },
];

function OtherSettings() {
  return (
    <section className={section()}>
      <p className={subtitle()}>Other</p>
      <div className="mt-2">
        {otherSettingsData.map((item) =>
          item.modal_id ? (
            <ModalTrigger key={item.id} modalType={item.modal_id}>
              <SettingTrigger title={item.title} icon={item.icon} />
            </ModalTrigger>
          ) : (
            <div key={item.id}>
              <SettingTrigger title={item.title} icon={item.icon} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export default OtherSettings;
