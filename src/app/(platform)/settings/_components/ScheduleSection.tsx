import {
  useRestaurantHolidays,
  useRestaurantSchedule,
  useUpdateRestaurantSchedule,
} from "@/hooks/apis/useRestaurants";
import Schedule, { DaySchedule, TimeSlot } from "./Scheduler/Scheduler";
import Button from "@ui/Button";
import { tv } from "tailwind-variants";
import { format, parseISO, isValid } from "date-fns";

const scheduleSectionStyles = tv({
  slots: {
    container: "mt-8 flex flex-col justify-between gap-4 sm:flex-row",
    side: "w-full",
    locationHeading: "mb-2 text-[18px] font-bold text-black/80",
    holidayRow: "my-1 flex w-full justify-between text-[11px]",
    holidaysContainer: "text-[10px] font-medium text-[#737373]",
    holidayButton: "mt-4 rounded-md px-15 py-3 text-[14px] font-semibold",
    scheduleContainer: "border",
  },
});

const {
  container,
  holidayRow,
  side,
  locationHeading,
  holidayButton,
  holidaysContainer,
  scheduleContainer,
} = scheduleSectionStyles();

interface ScheduleSectionProps {
  onClose: () => void;
  restaurantId: number;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  onClose,
  restaurantId,
}) => {
  const {
    data: schedule,
    isLoading: isLoadingSchedule,
    isError: isScheduleError,
    error: scheduleError,
  } = useRestaurantSchedule(restaurantId);

  const {
    data: holidays,
    isLoading: isLoadingHolidays,
    isError: isHolidaysError,
  } = useRestaurantHolidays(restaurantId);

  const { mutate: updateSchedule } = useUpdateRestaurantSchedule(restaurantId);

  const handleSaveSchedule = (updatedSchedule: DaySchedule[]) => {
    type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
    
    const apiPayload = {
      opening_hours: {
        mon: [] as TimeSlot[],
        tue: [] as TimeSlot[],
        wed: [] as TimeSlot[],
        thu: [] as TimeSlot[],
        fri: [] as TimeSlot[],
        sat: [] as TimeSlot[],
        sun: [] as TimeSlot[]
      }
    };
  
    if (updatedSchedule) {
      updatedSchedule.forEach((daySchedule) => {
        const day = daySchedule.day.toLowerCase() as DayKey;
        
        const validSlots = daySchedule.timeSlots.filter(
          slot => slot.start && slot.end
        );
  
        apiPayload.opening_hours[day] = validSlots;
      });
    }
  
    updateSchedule(apiPayload);
  };

  const handleCancelSchedule = () => {
    console.log("Schedule edit cancelled");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "MMM dd, yyyy");
      }
      return dateString;
    } catch (e) {
      console.error("Error parsing date:", e);
      return dateString;
    }
  };

  return (
    <div className={container()}>
      <div className={side()}>
        <h2 className={locationHeading()}>Restaurant ID: {restaurantId}</h2>
        <div className={holidaysContainer()}>
          <p className="mb-2 font-medium">Upcoming holidays</p>

          {isLoadingHolidays && (
            <p className="text-xs italic">Loading holidays...</p>
          )}

          {isHolidaysError && (
            <p className="text-xs text-red-500">Failed to load holidays</p>
          )}

          {holidays && holidays.length === 0 && (
            <p className="text-xs italic">No holidays scheduled</p>
          )}

          {holidays && holidays.length > 0 && (
            <ul>
              {holidays.map((holiday) => (
                <li key={holiday.id} className={holidayRow()}>
                  <p>
                    {holiday.start_date === holiday.end_date
                      ? formatDate(holiday.start_date)
                      : `${formatDate(holiday.start_date)} - ${formatDate(holiday.end_date)}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button className={holidayButton()} onClick={onClose} size="lg">
          Holidays
        </Button>
      </div>
      <Schedule
        initialSchedule={schedule}
        onSave={handleSaveSchedule}
        onCancel={handleCancelSchedule}
        isLoading={isLoadingSchedule}
        isError={isScheduleError}
        errorMessage={
          scheduleError instanceof Error
            ? scheduleError.message
            : "Failed to load schedule"
        }
        className={scheduleContainer()}
      />
    </div>
  );
};

export default ScheduleSection;
