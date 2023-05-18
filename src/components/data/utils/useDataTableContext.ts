import dayjs, { type Dayjs } from "dayjs";

export interface DataTableContext {
  expandCategory(category: string): void;
  passedDaysRatio: number | null;
}

const today = dayjs();

export const useDataTableContext = (
  expandCategory: (category: string) => void,
  isRangePicker: boolean,
  rangeStart: Dayjs | null
): DataTableContext => {
  const isCurrentMonth =
    rangeStart &&
    today.month() === rangeStart.month() &&
    today.year() === rangeStart.year();

  return {
    expandCategory,
    passedDaysRatio: isRangePicker
      ? null
      : isCurrentMonth
      ? today.date() / rangeStart.daysInMonth()
      : 1,
  };
};
