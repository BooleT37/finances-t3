import type { ExpenseComponent, Prisma } from "@prisma/client";
import { isEqual, omit } from "lodash";
import type Expense from "~/models/Expense";
import { isTempId } from "~/utils/tempId";
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
    source: connectIfExists(expense.source),
    subscription: connectIfExists(expense.subscription),
    savingSpendingCategory: connectIfExists(
      expense.savingSpending?.category ?? null
    ),
    components: {
      createMany: {
        data: expense.components.map((component) =>
          omit(component.asJSON, ["expenseId", "id"])
        ),
      },
    },
  };
}

export function adaptExpenseToUpdateInput(
  expense: Expense,
  originalComponents: ExpenseComponent[]
): Prisma.ExpenseUpdateInput {
  const components = expense.components.map((c) => c.asJSON);
  const newComponents = components
    .filter(({ id }) => isTempId(id))
    .map((component) => omit(component, ["expenseId", "id"]));
  const updatedComponents = components.filter((component) => {
    if (isTempId(component.id)) {
      return false;
    }
    const originalComponent = originalComponents.find(
      ({ id }) => id === component.id
    );
    if (!originalComponent) {
      throw new Error(
        `Can't update the component. The original component with id ${component.id} is not found`
      );
    }
    return !isEqual(originalComponent, component);
  });
  const removedComponents = originalComponents.filter(
    ({ id }) => !components.some((component) => component.id === id)
  );
  return {
    ...adaptExpenseToCreateInput(expense),
    components: {
      createMany: {
        data: newComponents,
      },
      update: updatedComponents.map((component) => ({
        data: {
          categoryId: component.categoryId,
          cost: component.cost,
          subcategoryId: component.subcategoryId,
        },
        where: { id: component.id },
      })),
      deleteMany: {
        id: {
          in: removedComponents.map(({ id }) => id),
        },
      },
    },
  };
}
