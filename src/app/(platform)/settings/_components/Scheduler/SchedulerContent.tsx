import React, { useState, useEffect } from "react";
import { tv } from "tailwind-variants";
import { TimeSlot } from "./Scheduler";
import { VscClose } from "react-icons/vsc";
import AnimatedInputField from "./AnimatedInputField";
import AnimateChangeInHeight from "@/libs/AnimateChangeInHeight";

export const contentStyles = tv({
  slots: {
    container: "p-1",
    slotWrapper: "mb-1",
    slotLabel: "text-[10px] font-bold text-[#4A4A4A]",
    inputsContainer: "mt-1 flex items-center justify-evenly gap-1 pl-2",
    inputWrapper: "text-brand-main w-[150px]",
    clearButton:
      "flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500",
  },
});

const {
  container,
  slotWrapper,
  slotLabel,
  inputsContainer,
  inputWrapper,
  clearButton,
} = contentStyles();

interface SchedulerContentProps {
  timeSlots: TimeSlot[];
  dayIndex: number;
  handleTimeChange: (
    dayIndex: number,
    slotIndex: number,
    type: "start" | "end",
    value: string,
  ) => void;
  handleClearTimeSlot: (dayIndex: number, slotIndex: number) => void;
  isExpanded: boolean;
}

const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

const SchedulerContent: React.FC<SchedulerContentProps> = ({
  timeSlots,
  dayIndex,
  handleTimeChange,
  handleClearTimeSlot,
  isExpanded,
}) => {
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const errors: { [key: string]: boolean } = {};

    timeSlots.forEach((slot, slotIndex) => {
      const startKey = `${dayIndex}-${slotIndex}-start`;
      const endKey = `${dayIndex}-${slotIndex}-end`;

      if (slot.start && !timeRegex.test(slot.start)) {
        errors[startKey] = true;
      }

      if (slot.end && !timeRegex.test(slot.end)) {
        errors[endKey] = true;
      }
    });

    setValidationErrors(errors);
  }, [timeSlots, dayIndex]);

  const handleTimeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dayIndex: number,
    slotIndex: number,
    type: "start" | "end",
  ) => {
    const value = e.target.value;
    const key = `${dayIndex}-${slotIndex}-${type}`;
    const isValid = value === "" || timeRegex.test(value);

    setValidationErrors((prev) => ({
      ...prev,
      [key]: !isValid,
    }));

    handleTimeChange(dayIndex, slotIndex, type, value);
  };

  const handleClear = (
    e: React.MouseEvent,
    dayIndex: number,
    slotIndex: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startKey = `${dayIndex}-${slotIndex}-start`;
    const endKey = `${dayIndex}-${slotIndex}-end`;

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[startKey];
      delete newErrors[endKey];
      return newErrors;
    });

    handleClearTimeSlot(dayIndex, slotIndex);
  };

  // Use AnimateChangeInHeight to properly animate the content
  return (
    <AnimateChangeInHeight isOpen={isExpanded}>
      <div className={container()}>
        {timeSlots.map((slot, slotIndex) => (
          <div key={slotIndex} className={slotWrapper()}>
            <div>
              <span className={slotLabel()}>
                {slotIndex === 0 ? "First shift" : "Second shift"}
              </span>
            </div>
            <div className={inputsContainer()}>
              <div className={inputWrapper()}>
                <AnimatedInputField
                  id={`slotIndex-${dayIndex}-${slotIndex}-start`}
                  type="text"
                  value={slot.start}
                  label="opening"
                  placeholder="HH:MM"
                  error={validationErrors[`${dayIndex}-${slotIndex}-start`] || false}
                  errorMessage="Use HH:MM format"
                  onChange={(e) => handleTimeInputChange(e, dayIndex, slotIndex, "start")}
                />
              </div>
              <span className="text-brand-main">—</span>
              <div className={inputWrapper()}>
                <AnimatedInputField
                  id={`slotIndex-${dayIndex}-${slotIndex}-end`}
                  type="text"
                  value={slot.end}
                  label="closing"
                  placeholder="HH:MM"
                  error={validationErrors[`${dayIndex}-${slotIndex}-end`] || false}
                  errorMessage="Use HH:MM format"
                  onChange={(e) => handleTimeInputChange(e, dayIndex, slotIndex, "end")}
                />
              </div>
              <button
                onClick={(e) => handleClear(e, dayIndex, slotIndex)}
                className={clearButton()}
                title="Clear this shift"
                type="button"
                aria-label="Clear shift times"
              >
                <VscClose />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AnimateChangeInHeight>
  );
};

export default SchedulerContent;