import { Popover } from "radix-ui";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { TiCalendar } from "react-icons/ti";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// const CustomDropdown: React.FC<DropdownProps> = () => {
//   return <></>;
// };

interface DatePickerProps
  extends Omit<React.ComponentProps<typeof DayPicker>, "mode" | "onSelect"> {
  placeholder?: string;
  onSelect?: (date?: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  placeholder = "Pick a Date",
  onSelect,
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <DatePickerTrigger
        data-state={open ? "open" : "closed"}
        placeholder={placeholder}
        selectedDate={selectedDate ? formatDate(selectedDate) : undefined}
      />
      <AnimatePresence>
        {open && (
          <Popover.Content
            forceMount
            data-state={open ? "open" : "closed"}
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DayPicker
                components={
                  {
                    // Dropdown: (props) => <CustomDropdown {...props} />,
                  }
                }
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setOpen(false);
                  if (onSelect) {
                    onSelect(date);
                  }
                }}
                mode="single"
                animate
                captionLayout="dropdown"
                firstWeekContainsDate={1}
                fixedWeeks
                showOutsideDays
                timeZone="Africa/Casablanca"
                weekStartsOn={1}
                {...props}
              />
            </motion.div>
          </Popover.Content>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};

interface DatePickerTriggerProps {
  placeholder: string;
  selectedDate?: string;
}

const DatePickerTrigger: React.FC<DatePickerTriggerProps> = ({
  placeholder,
  selectedDate,
}) => {
  return (
    <Popover.Trigger asChild>
      <button className="bg-light-1 text-brand-main flex min-w-[200px] cursor-pointer items-center justify-between gap-5 rounded-[10px] p-4 py-3 text-[12px] font-normal">
        <motion.span
          initial={{ opacity: 1 }}
          key={selectedDate || placeholder}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {selectedDate || placeholder}
        </motion.span>

        <TiCalendar size={20} />
      </button>
    </Popover.Trigger>
  );
};

export default DatePicker;
