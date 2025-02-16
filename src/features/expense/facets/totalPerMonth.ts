import type { CategoryType } from "@prisma/client";
import Decimal from "decimal.js";
import { decimalSum } from "~/utils/decimalSum";
import { useExpenses } from "./allExpenses";

export function useGetTotalExpensesPerMonth() {
  const { data: expenses = [] } = useExpenses();
  return ({
    year,
    month,
    excludeTypes = [],
  }: {
    year: number;
    month: number;
    excludeTypes?: CategoryType[];
  }): Decimal => {
    const monthExpenses = expenses.filter(
      (expense) =>
        expense.date.month() === month && expense.date.year() === year
    );

    return decimalSum(
      ...monthExpenses
        .filter(
          (expense) =>
            !(
              expense.category.type &&
              excludeTypes.includes(expense.category.type)
            )
        )
        .map((expense) => expense.costWithoutComponents ?? new Decimal(0))
    ).plus(
      decimalSum(
        ...monthExpenses.flatMap((e) =>
          e.components
            .filter(
              (c) =>
                !(c.category.type && excludeTypes.includes(c.category.type))
            )
            .map((c) => c.cost)
        )
      )
    );
  };
}
