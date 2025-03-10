import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { savingSpendingQueryParams } from "../api/savingSpendingApi";
import type { SavingSpendingFromApi } from "../api/types";
import SavingSpending from "../SavingSpending";
import SavingSpendingCategory from "../SavingSpendingCategory";

export function adaptSavingSpendingFromApi(
  savingSpending: SavingSpendingFromApi
) {
  return new SavingSpending(
    savingSpending.id,
    savingSpending.name,
    savingSpending.completed,
    savingSpending.categories.map(
      (savingSpending) =>
        new SavingSpendingCategory(
          savingSpending.id,
          savingSpending.name,
          savingSpending.forecast,
          savingSpending.comment
        )
    )
  );
}

export const useSavingSpendings = () =>
  useQuery({
    ...savingSpendingQueryParams,
    select: useCallback(
      (data: SavingSpendingFromApi[]) => data.map(adaptSavingSpendingFromApi),
      []
    ),
  });
