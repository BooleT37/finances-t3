import { type FormValues } from "~/components/CostsListModal/CostsListForm";
import type NewSavingSpendingCategory from "~/models/NewSavingSpendingCategory";
import SavingSpendingCategory from "~/models/SavingSpendingCategory";
import SavingSpendingEditing from "~/models/SavingSpendingEditing";
import savingSpendingStore from "~/stores/savingSpendingStore";
import { isTempId } from "~/utils/tempId";

export async function saveSavingSpending(
  id: number,
  values: FormValues,
  originalCategories: SavingSpendingCategory[]
) {
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
        forecast: category.sum,
        name: category.name,
      };
      spending.categories.push(newCategory);
    } else {
      spending.categories.push(
        new SavingSpendingCategory(
          category.id,
          category.name,
          category.sum || 0,
          category.comment || ""
        )
      );
    }
  }
  if (id === -1) {
    await savingSpendingStore.addSpending(spending);
  } else {
    await savingSpendingStore.editSpending(spending);
  }
}
