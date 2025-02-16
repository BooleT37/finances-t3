import { type Dayjs } from "dayjs";
import Decimal from "decimal.js";
import { useCallback } from "react";
import countUniqueMonths from "~/utils/countUniqueMonths";
import { useExpenses } from "./allExpenses";

export const useTotalMonths = () => {
  const { data: expenses } = useExpenses();
  if (!expenses) return 0;

  return countUniqueMonths(
    expenses.flatMap((e) => [e.date, ...e.components.map(() => e.date)])
  );
};

export const useGetComparisonData = () => {
  const { data: expenses } = useExpenses();
  return useCallback(
    (from: Dayjs, to: Dayjs, granularity: "month" | "quarter" | "year") => {
      if (!expenses) return [];

      const expensesFrom = expenses.filter(
        (e) =>
          !e.category.isIncome &&
          !e.category.toSavings &&
          e.date.isSame(from, granularity)
      );
      const expensesTo = expenses.filter(
        (e) =>
          !e.category.isIncome &&
          !e.category.toSavings &&
          e.date.isSame(to, granularity)
      );

      const map: Record<string, { from: Decimal; to: Decimal }> = {};

      expensesFrom.forEach((e) => {
        if (e.cost !== null) {
          const categoryId = String(e.category.id);
          const categoryCosts = map[categoryId];
          if (categoryCosts === undefined) {
            map[categoryId] = { from: e.cost, to: new Decimal(0) };
          } else {
            categoryCosts.from = categoryCosts.from.add(e.cost);
          }
        }
      });

      expensesTo.forEach((e) => {
        if (e.cost !== null) {
          const categoryId = String(e.category.id);
          const categoryCosts = map[categoryId];
          if (categoryCosts === undefined) {
            map[categoryId] = { from: new Decimal(0), to: e.cost };
          } else {
            categoryCosts.to = categoryCosts.to.add(e.cost);
          }
        }
      });

      return Object.entries(map).map(([category, costs]) => ({
        category: category,
        period1: costs.from.toNumber(),
        period2: costs.to.toNumber(),
      }));
    },
    [expenses]
  );
};
