import { useCallback } from "react";
import type SavingSpending from "../SavingSpending";
import type SavingSpendingCategory from "../SavingSpendingCategory";
import { useSavingSpendings } from "./allSavingSpendings";

export const useSavingSpendingByCategoryId = () => {
  const { data: savingSpendings, isSuccess } = useSavingSpendings();

  const getSavingSpendingByCategoryId = useCallback(
    (
      categoryId: number
    ): {
      spending: SavingSpending;
      category: SavingSpendingCategory;
    } | null => {
      const spending = savingSpendings?.find((s) =>
        s.categories.some((c) => c.id === categoryId)
      );
      if (!spending) return null;
      return {
        spending,
        category: spending.categories.find((c) => c.id === categoryId)!,
      };
    },
    [savingSpendings]
  );
  if (!isSuccess) {
    return { loaded: false as const };
  }
  return { loaded: true as const, getSavingSpendingByCategoryId };
};
