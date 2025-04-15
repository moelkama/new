import { tv } from "tailwind-variants";
import { FiChevronDown } from "react-icons/fi";
import React from "react";
import { Day, TimeSlot } from "./Scheduler";

// Styles for the scheduler row
export const schedulerRowStyles = tv({
  slots: {
    rootStyles:
      "text-brand-main flex cursor-pointer items-center justify-between gap-2 p-3.5 text-[12px] font-medium",
    dayStyles: "w-16 text-[10px] font-medium",
    timeslotsContainerStyles: "flex w-full flex-wrap justify-around",
    slotItemStyles: "flex gap-1.5",
    slotTimeStyles: "font-mono",
    slotSeparatorStyles: "",
    iconStyles:
      "bg-light-1 rounded-sm p-0.5 text-[1rem] transition-transform duration-300",
  },
  variants: {
    expanded: {
      true: {
        rootStyles: "bg-gray-50",
        iconStyles: "rotate-0 transform",
      },
      false: {
        rootStyles: "",
        iconStyles: "-rotate-90 transform",
      },
    },
    alternate: {
      true: {
        rootStyles: "bg-light-1",
      },
      false: {
        rootStyles: "bg-white",
      },
    },
  },
  defaultVariants: {
    expanded: false,
    alternate: false,
  },
});

export interface SchedulerRowProps {
  day: Day;
  timeSlots: TimeSlot[];
  isExpanded: boolean;
  onToggle: () => void;
  isAlternate?: boolean;
  className?: string;
}

const SchedulerRow: React.FC<SchedulerRowProps> = ({
  day,
  timeSlots,
  isExpanded,
  onToggle,
  isAlternate = false,
  className = "",
}) => {
  const {
    rootStyles,
    dayStyles,
    timeslotsContainerStyles,
    slotItemStyles,
    slotTimeStyles,
    slotSeparatorStyles,
    iconStyles,
  } = schedulerRowStyles({
    expanded: isExpanded,
    alternate: isAlternate,
  });

  return (
    <div onClick={onToggle} className={rootStyles({ className })}>
      <span className={dayStyles()}>{day.toUpperCase()}</span>
      <div className={timeslotsContainerStyles()}>
        {timeSlots.map((slot, slotIndex) => (
          <div key={slotIndex} className={slotItemStyles()}>
            <span className={slotTimeStyles()}>{slot.start || "00:00"}</span>
            <span className={slotSeparatorStyles()}>-</span>
            <span className={slotTimeStyles()}>{slot.end || "00:00"}</span>
          </div>
        ))}
        {timeSlots.length === 1 && <span className="mx-2">-</span>}
      </div>
      <span className={iconStyles()}>
        <FiChevronDown />
      </span>
    </div>
  );
};

export default SchedulerRow;
