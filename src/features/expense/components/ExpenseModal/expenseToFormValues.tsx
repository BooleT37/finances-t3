import type Expense from "../../Expense";
import type { FormValues } from "./models";

export function expenseToFormValues(expense: Expense): FormValues {
  return {
    cost: String(expense.cost),
    category: expense.category.id ?? null,
    subcategory: expense.subcategoryId ?? undefined,
    name: expense.name || "",
    date: expense.date,
    source: expense.source?.id ?? undefined,
    subscription: expense.subscription?.id ?? undefined,
    savingSpendingId: expense.savingSpending
      ? expense.savingSpending.spending.id
      : undefined,
    savingSpendingCategoryId: expense.savingSpending
      ? expense.savingSpending.category.id
      : undefined,
    actualDate: expense.actualDate ?? undefined,
  };
}
