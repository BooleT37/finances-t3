import Decimal from "decimal.js";
import { type FormValues } from "~/components/CostsListModal/CostsListForm";
import {
  useAddSavingSpending,
  useUpdateSavingSpending,
} from "~/features/savingSpending/api/savingSpendingApi";
import type NewSavingSpendingCategory from "~/features/savingSpending/NewSavingSpendingCategory";
import SavingSpendingCategory from "~/features/savingSpending/SavingSpendingCategory";
import SavingSpendingEditing from "~/features/savingSpending/SavingSpendingEditing";
import { isTempId } from "~/utils/tempId";

export function useSaveSavingSpending() {
  const addSpending = useAddSavingSpending();
  const editSpending = useUpdateSavingSpending();
  return async (
    id: number,
    values: FormValues,
    originalCategories: SavingSpendingCategory[]
  ) => {
    const spending = new SavingSpendingEditing(
      id,
      values.name,
      originalCategories,
      []
    );
    for (const category of values.costs) {
      if (isTempId(category.id)) {
        const newCategory: NewSavingSpendingCategory = {
          comment: category.comment || "",
          forecast: new Decimal(category.sum),
          name: category.name,
        };
        spending.categories.push(newCategory);
      } else {
        spending.categories.push(
          new SavingSpendingCategory(
            category.id,
            category.name,
            new Decimal(category.sum ?? 0),
            category.comment || ""
          )
        );
      }
    }
    if (id === -1) {
      await addSpending.mutateAsync(spending);
    } else {
      await editSpending.mutateAsync(spending);
    }
  };
}
