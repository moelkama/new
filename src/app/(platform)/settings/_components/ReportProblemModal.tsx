import Collapsible from "@/components/ui/Collapsible";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import { FiTool } from "react-icons/fi";
import { tv } from "tailwind-variants";
import ReportProblemForm from "./ReportProblemForm";

const styles = tv({
  base: "",
  slots: {
    title: "text-heading-3 mb-6 font-medium",
  },
});

const { title, base } = styles();

interface ReportProblemModalProps {
  className?: string;
}

const ReportProblemModal: React.FC<ReportProblemModalProps> = ({
  className,
}) => {
  return (
    <Modal
      modalType="report_problem_modal"
      description="report a problem"
      title=""
      hideTitle
      className={base({ className })}
      contentClassName="max-w-[687px] px-8"
    >
      <h2 className={title()}>Report a Problem</h2>
      <Collapsible
        className="border-none"
        defaultOpen={true}
        disabled={true}
        title={"Technical Issues"}
        icon={
          <Icon
            as={FiTool}
            wrapperSize="md"
            iconSize="lg"
            wrapperVariant="primary"
          />
        }
        id={"Technical Issues"}
        triggerClassName="p-0 cursor-auto"
        triggerChevronClassName="text-brand-main size-3 hidden"
        triggerTextClassName="text-heading-7 uppercase font-medium tracking-[1px] "
      >
        <ReportProblemForm />
      </Collapsible>
    </Modal>
  );
};
export default ReportProblemModal;
