import type { Prisma } from "@prisma/client";
import type Expense from "~/models/Expense";
import { connectIfExists } from "../connectIfExists";

export function adaptExpenseToCreateInput(
  expense: Expense
): Prisma.ExpenseCreateInput {
  return {
    name: expense.name,
    cost: expense.cost,
    date: expense.date.toDate(),
    category: {
      connect: { id: expense.category.id },
    },
    subcategory: connectIfExists(expense.subcategory),
    personalExpense: connectIfExists(expense.personalExpense),
    source: connectIfExists(expense.source),
    subscription: connectIfExists(expense.subscription),
    savingSpendingCategory: connectIfExists(
      expense.savingSpending?.category ?? null
    ),
  };
}

export function adaptExpenseToUpdateInput(
  expense: Expense
): Prisma.ExpenseUpdateInput {
  return adaptExpenseToCreateInput(expense);
}
