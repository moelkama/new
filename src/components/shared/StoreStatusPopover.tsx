"use client";

import { useState } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";
import * as RadixPopover from "@radix-ui/react-popover";
import * as RadixLabel from "@radix-ui/react-label";
import Checkbox from "../ui/CheckBox";
import PopoverTrigger from "../ui/PopoverTrigger";
import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    content:
      "border-light-4 w-s rounded-2xl border-1 bg-white px-8 py-5 shadow-md",
    header: "mb-5 flex items-center gap-3",
    title: "text-[12px]",
    optionsContainer: "flex flex-col gap-2",
    option:
      "border-brand-accent flex min-w-[270px] items-center justify-center rounded-lg border-[0.5px] px-4 py-2",
    optionLabel: "cursor-pointer items-center justify-start gap-4",
    optionTitle: "mb-1 text-[10.88px] font-medium",
    optionDescription: "text-dark-3 text-[9.88px] font-normal",
  },
});

const {
  content,
  header,
  title,
  optionsContainer,
  option,
  optionLabel,
  optionTitle,
  optionDescription,
} = styles();

const StoreStatusPopover = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (newStatus: boolean) => {
    setIsOpen(newStatus);
  };

  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        <PopoverTrigger
          icon={isOpen ? <FiWifi size={24} /> : <FiWifiOff size={24} />}
          text="Store Status"
        />
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content sideOffset={5} className={content()}>
          <div className={header()}>
            <h3 className={title()}>Change Store Status</h3>
            <StatusTag isOpen={isOpen} />
          </div>
          <div className={optionsContainer()}>
            <StatusOption
              id="openStatus"
              checked={isOpen}
              onChange={() => handleStatusChange(true)}
              title="OPEN"
              description="Available to take orders as usual"
            />

            <StatusOption
              id="closedStatus"
              checked={!isOpen}
              onChange={() => handleStatusChange(false)}
              title="CLOSED"
              description="Not available to take new orders"
            />
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

const statusTagStyles = tv({
  slots: {
    container:
      "border-brand-accent flex items-center gap-2 rounded-[8px] border-1 p-2",
    icon: "text-brand-main",
    text: "text-brand-main text-[10px] font-bold",
  },
});

const { container, icon, text } = statusTagStyles();

const StatusTag = ({ isOpen }: { isOpen: boolean }) => (
  <span className={container()}>
    <span className={icon()}>
      {isOpen ? <FiWifi size={12} /> : <FiWifiOff size={12} />}
    </span>
    <span className={text()}>{isOpen ? "Open" : "Closed"}</span>
  </span>
);

interface StatusOptionProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}

const StatusOption = ({
  id,
  checked,
  onChange,
  title,
  description,
}: StatusOptionProps) => (
  <RadixPopover.Close
    aria-label="Close"
    asChild
    tabIndex={-1}
    onClick={onChange}
  >
    <RadixLabel.Root htmlFor={id} className={`${optionLabel()} ${option()}`}>
      <Checkbox
        size="large"
        checked={checked}
        onCheckedChange={onChange}
        id={id}
      />
      <div>
        <h4 className={optionTitle()}>{title}</h4>
        <p className={optionDescription()}>{description}</p>
      </div>
    </RadixLabel.Root>
  </RadixPopover.Close>
);

export default StoreStatusPopover;

// import { useStoreList } from './hooks/useStoreList';

// function TopBar({ selectedStoreId, onStoreSelect }) {
//   const { data: stores, isLoading } = useStoreList();

//   if (isLoading) return <div>Loading stores...</div>;

//   return (
//     <nav>
//       <select
//         value={selectedStoreId}
//         onChange={(e) => onStoreSelect(e.target.value)}
//       >
//         {stores?.map((store) => (
//           <option key={store.id} value={store.id}>
//             {store.name}
//           </option>
//         ))}
//       </select>
//     </nav>
//   );
// }
