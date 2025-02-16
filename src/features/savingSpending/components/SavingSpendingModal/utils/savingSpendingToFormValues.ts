import type { FormValues } from "~/components/CostsListModal/CostsListForm";
import type SavingSpending from "~/features/savingSpending/SavingSpending";

export function savingSpendingToFormValues(
  savingSpending: SavingSpending
): FormValues {
  return {
    name: savingSpending.name,
    costs: savingSpending.categories.map((c) => ({
      comment: c.comment,
      sum: c.forecast.toNumber(),
      name: c.name,
      id: c.id,
    })),
  };
}
