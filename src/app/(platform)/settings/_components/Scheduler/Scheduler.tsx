import React, { useEffect, useState, useCallback } from "react";
import Button from "@ui/Button";
import { Collapsible } from "radix-ui";
import SchedulerRow from "./SchedulerRow";
import SchedulerContent from "./SchedulerContent";
import { tv } from "tailwind-variants";

export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  day: Day;
  timeSlots: TimeSlot[];
  isExpanded?: boolean;
}

interface ScheduleProps {
  initialSchedule?: DaySchedule[];
  onSave?: (schedule: DaySchedule[]) => void;
  onCancel?: () => void;
  className?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export const schedulerStyles = tv({
  slots: {
    container: "",
    headerContainer: "mb-2 flex items-center justify-between",
    headerTitle: "text-[14px] font-medium",
    buttonsContainer: "flex items-center space-x-1",
    contentContainer:
      "h-[339px] w-[100%] overflow-y-auto rounded-[8px] border border-[#F3F3F3] sm:w-[330px]",
    loadingContainer: "pointer-events-none opacity-60",
    errorContainer: "",
  },
});

const {
  container,
  headerContainer,
  headerTitle,
  buttonsContainer,
  contentContainer,
  loadingContainer,
  errorContainer,
} = schedulerStyles();

const defaultSchedule: DaySchedule[] = [
  { day: "mon", timeSlots: [{ start: "", end: "" }, { start: "", end: "" }] },
  {
    day: "tue",
    timeSlots: [{ start: "08:00", end: "13:00" }, { start: "14:00", end: "19:00" }],
    isExpanded: true
  },
  { day: "wed", timeSlots: [{ start: "", end: "" }, { start: "", end: "" }] },
  { day: "thu", timeSlots: [{ start: "", end: "" }, { start: "", end: "" }] },
  { day: "fri", timeSlots: [{ start: "", end: "" }, { start: "", end: "" }] },
  { day: "sat", timeSlots: [{ start: "", end: "" }, { start: "", end: "" }] },
  { day: "sun", timeSlots: [{ start: "", end: "" }, { start: "", end: "" }] },
];

const normalizeSchedule = (schedule: DaySchedule[]): DaySchedule[] => {
  return schedule.map((day) => {
    const normalizedTimeSlots = Array(2)
      .fill(null)
      .map((_, index) => day.timeSlots[index] || { start: "", end: "" });

    return { ...day, timeSlots: normalizedTimeSlots };
  });
};

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const compareSchedules = (current: DaySchedule[], original: DaySchedule[]): boolean => {
  const currentForComparison = current.map(day => ({
    day: day.day,
    timeSlots: day.timeSlots
  }));

  const originalForComparison = original.map(day => ({
    day: day.day,
    timeSlots: day.timeSlots
  }));

  return JSON.stringify(currentForComparison) !== JSON.stringify(originalForComparison);
};

export const Schedule: React.FC<ScheduleProps> = ({
  initialSchedule = defaultSchedule,
  onSave,
  onCancel,
  className,
  isLoading = false,
  isError = false,
  errorMessage = "Error loading schedule data",
}) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    normalizeSchedule(initialSchedule)
  );
  const [originalSchedule, setOriginalSchedule] = useState<DaySchedule[]>(
    normalizeSchedule(initialSchedule)
  );
  const [hasModifications, setHasModifications] = useState<boolean>(false);
  const [hasValidationErrors, setHasValidationErrors] = useState<boolean>(false);



  const validateSchedule = useCallback((scheduleData: DaySchedule[]): boolean => {
    const isValidTimeSlot = (slot: TimeSlot): boolean => {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      const hasStart = !!slot.start;
      const hasEnd = !!slot.end;

      if ((hasStart && !hasEnd) || (!hasStart && hasEnd)) {
        return false;
      }

      if (hasStart && hasEnd) {
        return timeRegex.test(slot.start) && timeRegex.test(slot.end);
      }

      return true;
    };

    for (const day of scheduleData) {
      for (const slot of day.timeSlots) {
        if (!isValidTimeSlot(slot)) {
          return false;
        }
      }
    }
    return true;
  }, []);

  useEffect(() => {
    if (initialSchedule) {
      const normalized = normalizeSchedule(initialSchedule);
      setSchedule(deepClone(normalized));
      setOriginalSchedule(deepClone(normalized));
      setHasModifications(false);
    }
  }, [initialSchedule]);

  useEffect(() => {
    const isValid = validateSchedule(schedule);
    setHasValidationErrors(!isValid);

    const hasChanges = compareSchedules(schedule, originalSchedule);
    setHasModifications(hasChanges);
  }, [schedule, originalSchedule, validateSchedule]);

  // Modified to only allow one expanded day at a time
  const handleExpand = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, index) => ({
        ...day,
        // If this is the clicked day, toggle its state
        // Otherwise, ensure it's closed
        isExpanded: index === dayIndex ? !day.isExpanded : false
      }))
    );
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    type: "start" | "end",
    value: string,
  ) => {
    setSchedule((prev) => {
      const newSchedule = deepClone(prev);
      newSchedule[dayIndex].timeSlots[slotIndex][type] = value;
      return newSchedule;
    });
  };

  const handleClearTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule((prev) => {
      const newSchedule = deepClone(prev);
      newSchedule[dayIndex].timeSlots[slotIndex] = { start: "", end: "" };
      return newSchedule;
    });
  };

  const handleSave = () => {
    onSave?.(schedule);
    setOriginalSchedule(deepClone(schedule));
    setHasModifications(false);
  };

  const handleCancel = () => {
    const resetSchedule = deepClone(originalSchedule).map(
      (day: DaySchedule) => ({ ...day, isExpanded: false })
    );
    setSchedule(resetSchedule);
    setHasModifications(false);
    onCancel?.();
  };


  const getRowClassName = (index: number): string => {
    if (index === 0) return "rounded-t-[8px]";
    if (index === 6) return "rounded-b-[8px]";
    return "";
  };

  if (isLoading) {
    return (
      <div className={loadingContainer()}>
        <div className={headerContainer()}>
          <h3 className={headerTitle()}>Schedule</h3>
        </div>
        <div className={contentContainer()}>
          {defaultSchedule.map((day, dayIndex) => (
            <SchedulerRow
              key={day.day}
              day={day.day}
              timeSlots={day.timeSlots}
              isExpanded={false}
              onToggle={() => { }}
              isAlternate={dayIndex % 2 !== 0}
              className={getRowClassName(dayIndex)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <p className={errorContainer()}>{errorMessage}</p>;
  }

  return (
    <div className={container()}>
      <div className={headerContainer()}>
        <h3 className={headerTitle()}>Schedule</h3>
        {hasModifications && (
          <div className={buttonsContainer()}>
            <Button
              size="sm"
              variant="secondary"
              fullWidth
              className="w-[80px] rounded-sm text-[8px]"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={hasValidationErrors}
              size="sm"
              fullWidth
              className="w-[80px] rounded-sm text-[8px]"
              title={hasValidationErrors ? "Fix time format errors before saving" : "Save changes"}
            >
              Save
            </Button>
          </div>
        )}
      </div>
      <div className={contentContainer({ class: className })}>
        {schedule.map((day, dayIndex) => (
          <div key={`day-${day.day}-${dayIndex}`}>
            <Collapsible.Root open={day.isExpanded}>
              <Collapsible.Trigger asChild>
                <SchedulerRow
                  day={day.day}
                  timeSlots={day.timeSlots}
                  isExpanded={!!day.isExpanded}
                  onToggle={() => handleExpand(dayIndex)}
                  isAlternate={dayIndex % 2 !== 0}
                  className={getRowClassName(dayIndex)}
                />
              </Collapsible.Trigger>
              <SchedulerContent
                isExpanded={!!day.isExpanded}
                timeSlots={day.timeSlots}
                dayIndex={dayIndex}
                handleTimeChange={handleTimeChange}
                handleClearTimeSlot={handleClearTimeSlot}
              />
            </Collapsible.Root>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;