export const parseIsoDate = (
  isoDateStr: string | Date,
): { date: string; time: string } => {
  const dateObj = new Date(isoDateStr);

  const optionsDate = {
    year: "numeric",
    month: "short",
    day: "numeric",
  } as const;
  const formattedDate = dateObj
    .toLocaleDateString("en-US", optionsDate)
    .replace(",", "");

  const optionsTime = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  } as const;
  const formattedTime = dateObj
    .toLocaleTimeString("en-US", optionsTime)
    .replace(":", ".");

  return {
    date: formattedDate,
    time: formattedTime,
  };
};
