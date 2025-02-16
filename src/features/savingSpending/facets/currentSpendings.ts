import Decimal from "decimal.js";
import { useMemo } from "react";
import {
  useFromSavingsCategory,
  useToSavingsCategory,
} from "~/features/category/facets/savingsCategories";
import { useExpenses } from "~/features/expense/facets/allExpenses";
import { useUserSavings } from "~/features/userSettings/facets/userSavings";
import { decimalSum } from "~/utils/decimalSum";

export const useCurrentSpendings = () => {
  const savings = useUserSavings();
  const { data: expenses } = useExpenses();
  const fromSavingsCategory = useFromSavingsCategory();
  const toSavingsCategory = useToSavingsCategory();

  return useMemo(() => {
    if (!savings || !expenses || !fromSavingsCategory || !toSavingsCategory) {
      return null;
    }

    const toSavingsExpenses = expenses.filter(
      (e) => e.category.id === toSavingsCategory.id
    );

    const fromSavingsExpenses = expenses.filter(
      (e) => e.category.id === fromSavingsCategory.id
    );

    return decimalSum(
      ...toSavingsExpenses
        .concat(fromSavingsExpenses)
        .filter((expense) => expense.date.isSameOrAfter(savings.date, "date"))
        .map((expense) =>
          expense.category.type === "FROM_SAVINGS"
            ? (expense.cost ?? new Decimal(0)).negated()
            : expense.cost
        )
    ).plus(savings.sum);
  }, [savings, expenses, fromSavingsCategory, toSavingsCategory]);
};
