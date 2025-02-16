import { useMemo } from "react";
import { getToday } from "~/utils/today";
import { useExpenses } from "./allExpenses";

export const useBoundaryDates = () => {
  const { data: expenses } = useExpenses();
  return useMemo(() => {
    if (!expenses) return [getToday(), getToday()];

    const sorted = [...expenses].sort(
      (e1, e2) => e1.date.valueOf() - e2.date.valueOf()
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if (!first || !last) return [getToday(), getToday()];
    return [first.date, last.date] as const;
  }, [expenses]);
};
