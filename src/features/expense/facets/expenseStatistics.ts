import { type Dayjs } from "dayjs";
import Decimal from "decimal.js";
import { useCallback } from "react";
import { useSortAllCategoriesById } from "~/features/category/facets/categoriesOrder";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import type { ComparisonData } from "~/features/statistics/components/ComparisonChart/models";
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
  const { loaded: categoryLoaded, getCategoryById } = useGetCategoryById();
  const compareCategories = useSortAllCategoriesById();

  return useCallback(
    (
      from: Dayjs,
      to: Dayjs,
      granularity: "month" | "quarter" | "year",
      showIncome = false,
      sortBy: "category" | "period1" | "period2" = "category"
    ): ComparisonData => {
      if (!expenses || !categoryLoaded) return [];

      const expensesFrom = expenses.filter(
        (e) =>
          !e.category.toSavings &&
          (showIncome || !e.category.isIncome) &&
          e.date.isSame(from, granularity)
      );
      const expensesTo = expenses.filter(
        (e) =>
          !e.category.toSavings &&
          (showIncome || !e.category.isIncome) &&
          e.date.isSame(to, granularity)
      );

      const map: Record<string, { from: Decimal; to: Decimal }> = {};

      expensesFrom.forEach((e) => {
        if (e.cost !== null) {
          // sign is not important in comparison,
          // we always compare income with income and expenses with expenses
          const cost = e.cost.abs();
          const categoryId = String(e.category.id);
          const categoryCosts = map[categoryId];
          if (categoryCosts === undefined) {
            map[categoryId] = { from: cost, to: new Decimal(0) };
          } else {
            categoryCosts.from = categoryCosts.from.add(cost);
          }
        }
      });

      expensesTo.forEach((e) => {
        if (e.cost !== null) {
          const cost = e.cost.abs();
          const categoryId = String(e.category.id);
          const categoryCosts = map[categoryId];
          if (categoryCosts === undefined) {
            map[categoryId] = { from: new Decimal(0), to: cost };
          } else {
            categoryCosts.to = categoryCosts.to.add(cost);
          }
        }
      });

      const result = Object.entries(map).map(([categoryId, costs]) => {
        const category = getCategoryById(Number(categoryId));
        return {
          categoryId: Number(categoryId),
          category: category?.shortname ?? "Неизвестная категория",
          isIncome: category?.isIncome ?? false,
          period1: costs.from.toNumber(),
          period2: costs.to.toNumber(),
        };
      });

      // Apply sorting based on the sortBy parameter
      if (sortBy === "category") {
        return result.sort(
          ({ categoryId: categoryId1 }, { categoryId: categoryId2 }) =>
            compareCategories(categoryId1, categoryId2)
        );
      } else if (sortBy === "period1") {
        return result.sort((a, b) => b.period1 - a.period1);
      } else if (sortBy === "period2") {
        return result.sort((a, b) => b.period2 - a.period2);
      }

      return result;
    },
    [categoryLoaded, compareCategories, expenses, getCategoryById]
  );
};
