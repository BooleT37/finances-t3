import { useMemo } from "react";
import { useCategories } from "./allCategories";
import { useExpenseCategories } from "./expenseCategories";
import { useIncomeCategories } from "./incomeCategories";

export const useCategoriesOptions = () => {
  const { data: categories } = useCategories();
  return useMemo(() => categories?.map((c) => c.asOption) ?? [], [categories]);
};

export const useExpenseCategoriesOptions = () => {
  const expenseCategories = useExpenseCategories();
  return useMemo(
    () => expenseCategories?.map((c) => c.asOption),
    [expenseCategories]
  );
};

export const useIncomeCategoriesOptions = () => {
  const incomeCategories = useIncomeCategories();
  return useMemo(
    () => incomeCategories?.map((c) => c.asOption),
    [incomeCategories]
  );
};
