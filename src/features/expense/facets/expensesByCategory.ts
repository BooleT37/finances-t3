import { groupBy } from "lodash";
import { useCallback, useMemo } from "react";
import { useExpenses } from "./allExpenses";

export const useExpensesByCategoryId = () => {
  const { data: expenses } = useExpenses();
  return useMemo(() => groupBy(expenses, "category.id"), [expenses]);
};

export const useGetExpensesByCategoryId = () => {
  const expensesByCategoryId = useExpensesByCategoryId();
  return useCallback(
    (categoryId: number) => expensesByCategoryId[categoryId] ?? [],
    [expensesByCategoryId]
  );
};

export const useGetExpensesByCategoryIdForYear = () => {
  const getExpensesByCategoryId = useGetExpensesByCategoryId();
  return useCallback(
    (year: number) => groupBy(getExpensesByCategoryId(year), "category.id"),
    [getExpensesByCategoryId]
  );
};
