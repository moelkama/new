import { useState } from "react";
import ScheduleSection from "./ScheduleSection";
import HolidaySection from "./HolidaySection";

interface ScheduleAndHolidaysProps {
  restaurantId: number;
}

const ScheduleAndHolidays: React.FC<ScheduleAndHolidaysProps> = ({
  restaurantId,
}) => {
  const [active, setActive] = useState("schedule");

  return (
    <div>
      {active === "schedule" ? (
        <ScheduleSection
          onClose={() => {
            setActive("holiday");
          }}
          restaurantId={restaurantId}
        />
      ) : (
        <HolidaySection
          onClose={() => {
            setActive("schedule");
          }}
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
};

export default ScheduleAndHolidays;
