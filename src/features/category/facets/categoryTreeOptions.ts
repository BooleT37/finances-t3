import { useMemo } from "react";
import { useExpenseCategories } from "./expenseCategories";
import { useIncomeCategories } from "./incomeCategories";

export const useExpenseCategoriesTreeOptions = () => {
  const expenseCategories = useExpenseCategories();
  return useMemo(
    () => expenseCategories?.map((c) => c.asTreeOption),
    [expenseCategories]
  );
};

export const useIncomeCategoriesTreeOptions = () => {
  const incomeCategories = useIncomeCategories();
  return useMemo(
    () => incomeCategories?.map((c) => c.asTreeOption),
    [incomeCategories]
  );
};
