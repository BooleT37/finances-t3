import dayjs from "dayjs";
import { action } from "mobx";
import Expense from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import { type ExpenseFromApi } from "~/types/apiTypes";

function getSavingSpendingByCategoryId(id: number): Expense["savingSpending"] {
  for (const spending of dataStores.savingSpendingStore.savingSpendings) {
    const found = spending.categories.find((c) => c.id === id);
    if (found) {
      return {
        spending,
        category: found,
      };
    }
  }
  throw new Error(`Can't find spending by category id ${id}`);
}

export const adaptExpenseFromApi = action(
  (expense: ExpenseFromApi): Expense => {
    const category = dataStores.categoriesStore.getById(expense.categoryId);
    return new Expense(
      expense.id,
      expense.cost,
      expense.components,
      dayjs(expense.date),
      category,
      expense.subcategoryId === null
        ? null
        : category.findSubcategoryById(expense.subcategoryId),
      expense.name,
      expense.sourceId === null
        ? null
        : dataStores.sourcesStore.getById(expense.sourceId),
      expense.subscriptionId === null
        ? null
        : dataStores.subscriptionStore.getById(expense.subscriptionId),
      expense.savingSpendingCategoryId === null
        ? null
        : getSavingSpendingByCategoryId(expense.savingSpendingCategoryId),
      expense.actualDate ? dayjs(expense.actualDate) : null
    );
  }
);
