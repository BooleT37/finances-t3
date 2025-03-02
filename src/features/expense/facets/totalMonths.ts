import { useCallback } from "react";
import { useExpensesAndComponents } from "~/features/expense/facets/expensesAndComponents";
import countUniqueMonths from "~/utils/countUniqueMonths";

export const useGetTotalExpensesMonths = () => {
  const expensesAndComponents = useExpensesAndComponents();
  return useCallback(
    () => countUniqueMonths((expensesAndComponents ?? []).map((e) => e.date)),
    [expensesAndComponents]
  );
};
