import { useCallback, useMemo } from "react";
import { useExpenses } from "./allExpenses";

export const useExpenseById = () => {
  const { data: expenses, isSuccess } = useExpenses();
  const getExpenseById = useCallback(
    (id: number) => {
      const found = expenses?.find((e) => e.id === id);
      if (!found) {
        throw new Error("Expense not found");
      }
      return found;
    },
    [expenses]
  );
  return useMemo(() => {
    if (!isSuccess) {
      return { loaded: false as const };
    }
    return { loaded: true as const, getExpenseById };
  }, [isSuccess, getExpenseById]);
};
