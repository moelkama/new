import { tv } from "tailwind-variants";
import { useState } from "react";

import { format } from "date-fns";
import {
  useHolidayOperations,
  useRestaurantHolidays,
} from "@/hooks/apis/useRestaurants";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker/DatePicker";

// TV slots for the component structure
const holidaySectionStyles = tv({
  slots: {
    container: "",
    header: "mb-2 text-[18px] font-extrabold",
    description: "mb-5 text-[11px] font-medium text-[#737373]",
    datePickersContainer: "flex flex-col gap-5 sm:flex-row",
    buttonsContainer: "my-10 flex gap-3",
    primaryButton: "rounded-md px-8 py-2.5 font-medium",
    secondaryButton: "rounded-md px-8 py-2.5 font-medium",
    holidayList: "my-6",
    holidayItem:
      "flex items-center justify-between py-2 text-[10px] text-[#737373]",
    holidayDate: "text-sm",
    deleteButton: "cursor-pointer text-xs text-red-400 hover:underline",
    loading: "py-4 text-center text-gray-500",
    error: "py-4 text-center text-red-400",
  },
});

// Extract the styles
const {
  container,
  header,
  description,
  datePickersContainer,
  buttonsContainer,
  primaryButton,
  secondaryButton,
  holidayList,
  holidayItem,
  holidayDate,
  deleteButton,
  loading,
  error,
} = holidaySectionStyles();

interface HolidaySectionProps {
  onClose: () => void;
  restaurantId: number;
}
const HolidaySection: React.FC<HolidaySectionProps> = ({
  onClose,
  restaurantId,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [deletingHolidayId, setDeletingHolidayId] = useState<number | null>(
    null,
  );

  const {
    data: holidays,
    isLoading,
    isError,
    error: holidaysError,
  } = useRestaurantHolidays(restaurantId);

  const { addHoliday, deleteHoliday } = useHolidayOperations(restaurantId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    try {
      setSubmitting(true);
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      await addHoliday.mutateAsync({
        start_date: startDateStr,
        end_date: endDateStr,
      });

      setStartDate(undefined);
      setEndDate(undefined);
    } catch (err) {
      console.error("Failed to add holiday:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHoliday = async (holidayId: number) => {
    if (confirm("Are you sure you want to delete this holiday?")) {
      setDeletingHolidayId(holidayId);

      try {
        const deleteMutation = deleteHoliday(holidayId);
        await deleteMutation.mutateAsync();
      } catch (err) {
        console.error("Failed to delete holiday:", err);
      } finally {
        setDeletingHolidayId(null);
      }
    }
  };

  const endDateDisabled = { before: startDate ? startDate : new Date() };

  return (
    <form className={container()} onSubmit={handleSubmit}>
      <h1 className={header()}>Holiday Section</h1>
      <p className={description()}>
        Set up holidays for your store to let customers know when the store is
        closed. Keep in mind that you can always edit your holidays.
      </p>

      <div className={datePickersContainer()}>
        <DatePicker
          startMonth={new Date()}
          showOutsideDays
          endMonth={
            new Date(new Date().setFullYear(new Date().getFullYear() + 10))
          }
          required
          placeholder="Start Date"
          onSelect={(date?: Date) => {
            setStartDate(date);
            if (date && endDate && endDate < date) {
              setEndDate(undefined);
            }
          }}
          disabled={{ before: new Date() }}
          defaultMonth={startDate}
        />
        <DatePicker
          showOutsideDays
          required
          placeholder="End Date"
          onSelect={(date?: Date) => setEndDate(date)}
          disabled={endDateDisabled}
          endMonth={
            new Date(new Date().setFullYear(new Date().getFullYear() + 10))
          }
          startMonth={new Date()}
          defaultMonth={endDate}
        />
      </div>

      {/* Holiday list */}
      <div className={holidayList()}>
        <h2 className="text-md mb-2 font-semibold">Current Holidays</h2>

        {isLoading && <p className={loading()}>Loading holidays...</p>}

        {isError && (
          <p className={error()}>
            {holidaysError instanceof Error
              ? holidaysError.message
              : "Failed to load holidays"}
          </p>
        )}

        {holidays && holidays.length === 0 && (
          <p className="text-sm text-gray-500">No holidays scheduled</p>
        )}

        {holidays?.map((holiday) => (
            <div key={holiday.id} className={holidayItem()}>
              <div className={holidayDate()}>
                {holiday.start_date === holiday.end_date
                  ? holiday.start_date
                  : `${holiday.start_date} to ${holiday.end_date}`}
              </div>
              <button
                type="button"
                onClick={() => handleDeleteHoliday(holiday.id)}
                className={deleteButton()}
                disabled={deletingHolidayId === holiday.id}
              >
                {deletingHolidayId === holiday.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
      </div>

      <div className={buttonsContainer()}>
        <Button
          className={primaryButton()}
          size="md"
          type="submit"
          //   disabled={
          //     !startDate || !endDate || submitting || addHoliday.isPending
          //   }
        >
          {submitting || addHoliday.isPending ? "Saving..." : "Set Holiday"}
        </Button>
        <Button
          variant="secondary"
          onClick={onClose}
          size="md"
          className={secondaryButton()}
          disabled={submitting || addHoliday.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default HolidaySection;
