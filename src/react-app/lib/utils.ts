import dayjs from "dayjs";

export const parseBussinessHour = (t: string | null) => {
  const now = dayjs();
  const currentBussinessHour = t ? t.split(":") : null;
  if (!currentBussinessHour) {
    return;
  }

  const [hour, minute] = currentBussinessHour;

  return t ? now.hour(Number(hour)).minute(Number(minute)).second(0) : null;
};

export const inRange = (start: string | null, end: string | null) => {
  return (
    start &&
    end &&
    dayjs().isBetween(
      parseBussinessHour(start),
      parseBussinessHour(end),
      null,
      "[]"
    )
  );
};
