import Decimal from "decimal.js";
import { useCallback } from "react";
import { useExpenses } from "~/features/expense/facets/allExpenses";
import { decimalSum } from "~/utils/decimalSum";

export const useGetSavingSpendingCategoryExpenses = () => {
  const { data: expenses } = useExpenses();
  return useCallback(
    (categoryId: number) => {
      if (!expenses) return new Decimal(0);
      return decimalSum(
        ...expenses
          .filter(
            (e) =>
              e.savingSpending && e.savingSpending.category.id === categoryId
          )
          .map((e) => e.cost ?? new Decimal(0))
      );
    },
    [expenses]
  );
};
