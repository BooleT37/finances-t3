import { useCallback } from "react";
import { useExpenses } from "~/features/expense/facets/allExpenses";
import type { ParsedExpense } from "../ParsedExpense";

export const useGetExistingExpense = () => {
  const { data: expenses } = useExpenses();
  return useCallback(
    (parsedExpense: ParsedExpense) =>
      expenses?.find(
        (e) =>
          e.peHash === parsedExpense.hash ||
          ((e.date.isSame(parsedExpense.date, "day") ||
            e.actualDate?.isSame(parsedExpense.date, "day")) &&
            e.cost.eq(parsedExpense.amount))
      ),
    [expenses]
  );
};
