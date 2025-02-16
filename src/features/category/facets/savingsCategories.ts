import { useMemo } from "react";
import { useCategories } from "./allCategories";
import { useExpenseCategories } from "./expenseCategories";

export const useFromSavingsCategory = () => {
  const { data: categories } = useCategories();
  return useMemo(() => categories?.find((c) => c.fromSavings), [categories]);
};

export const useToSavingsCategory = () => {
  const { data: categories } = useCategories();
  return useMemo(() => categories?.find((c) => c.toSavings), [categories]);
};

export const useSavingsCategories = () => {
  const expenseCategories = useExpenseCategories();
  return useMemo(
    () => expenseCategories?.filter((c) => c.isSavings) ?? [],
    [expenseCategories]
  );
};
