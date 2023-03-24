import {
  type SavingSpending as ApiSavingSpending,
  type SavingSpendingCategory as ApiSavingSpendingCategory,
} from "@prisma/client";
import SavingSpending from "~/models/SavingSpending";
import SavingSpendingCategory from "~/models/SavingSpendingCategory";

export function adaptSavingSpendingFromApi(
  savingSpending: ApiSavingSpending & {
    categories: ApiSavingSpendingCategory[];
  }
) {
  return new SavingSpending(
    savingSpending.id,
    savingSpending.name,
    savingSpending.completed,
    savingSpending.categories.map(
      (savingSpendingc) =>
        new SavingSpendingCategory(
          savingSpendingc.id,
          savingSpendingc.name,
          savingSpendingc.forecast,
          savingSpendingc.comment
        )
    )
  );
}
