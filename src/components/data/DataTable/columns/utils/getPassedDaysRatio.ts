import dayjs from "dayjs";

const today = dayjs();

export const getPassedDaysRatio = ({
  currentMonth,
  currentYear,
  isRangePicker,
}: {
  currentMonth: number;
  currentYear: number;
  isRangePicker: boolean;
}) => {
  if (isRangePicker) {
    return null;
  }
  const isCurrentMonth =
    today.month() === currentMonth && today.year() === currentYear;
  const daysInMonth = dayjs(new Date(currentYear, currentMonth)).daysInMonth();
  return isCurrentMonth ? today.date() / daysInMonth : 1;
};
