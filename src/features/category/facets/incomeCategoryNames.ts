import { useMemo } from "react";
import { useIncomeCategories } from "./incomeCategories";

export const useIncomeCategoriesNames = () => {
  const incomeCategories = useIncomeCategories();
  return useMemo(
    () => incomeCategories?.map((c) => c.name),
    [incomeCategories]
  );
};
