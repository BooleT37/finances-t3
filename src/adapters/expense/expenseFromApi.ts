import type { Expense as ApiExpense } from "@prisma/client";
import dayjs from "dayjs";
import Expense from "~/models/Expense";
import categoriesStore from "~/stores/categoriesStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import sourcesStore from "~/stores/sourcesStore";
import subscriptionStore from "~/stores/subscriptionStore";

function getSavingSpendingByCategoryId(id: number): Expense["savingSpending"] {
  for (const spending of savingSpendingStore.savingSpendings) {
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

export function adaptExpenseFromApi(expense: ApiExpense): Expense {
  const category = categoriesStore.getById(expense.categoryId);
  return new Expense(
    expense.id,
    expense.cost,
    dayjs(expense.date),
    category,
    expense.subcategoryId === null
      ? null
      : category.findSubcategoryById(expense.subcategoryId),
    expense.name,
    expense.personalExpenseId,
    expense.sourceId === null ? null : sourcesStore.getById(expense.sourceId),
    expense.subscriptionId === null
      ? null
      : subscriptionStore.getById(expense.subscriptionId),
    expense.savingSpendingCategoryId === null
      ? null
      : getSavingSpendingByCategoryId(expense.savingSpendingCategoryId)
  );
}
