import {
  type ExpenseComponent as ExpenseComponentApi,
  type Prisma,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { isEqual, omit } from "lodash";
import type Subcategory from "~/features/category/Subcategory";
import { trpc } from "~/utils/api";
import { isTempId } from "~/utils/tempId";
import type Expense from "../Expense";
import type { ExpenseFromApi } from "./types";

export const expensesKeys = {
  all: ["expenses"] as const,
};

export const expensesQueryParams = {
  queryKey: expensesKeys.all,
  queryFn: () => trpc.expense.getAll.query(),
} as const;

function connectIfExists<T extends { id: number }>(object: T | null) {
  return object ? { connect: { id: object.id } } : undefined;
}

function adaptExpenseToCreateInput(
  expense: Expense
): Prisma.ExpenseCreateInput {
  return {
    name: expense.name,
    cost: expense.cost.abs(),
    date: expense.date.toDate(),
    actualDate: expense.actualDate ? expense.actualDate.toDate() : null,
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
        data: expense.components.map((component) => ({
          ...omit(component.asApi, ["expenseId", "id"]),
          cost: component.cost.abs(),
        })),
      },
    },
    peHash: expense.peHash,
  };
}

function adaptExpenseToCreateManyInput(
  expense: Expense
): Prisma.ExpenseCreateManyInput {
  return {
    name: expense.name,
    cost: expense.cost.abs(),
    date: expense.date.toDate(),
    actualDate: expense.actualDate ? expense.actualDate.toDate() : null,
    categoryId: expense.category.id,
    sourceId: expense.source?.id ?? null,
    subscriptionId: expense.subscription?.id ?? null,
    savingSpendingCategoryId: expense.savingSpending?.category?.id ?? null,
    subcategoryId: expense.subcategory?.id ?? null,
    peHash: expense.peHash,
  };
}

function adaptExpenseToUpdateInput(
  expense: Expense,
  originalComponents: ExpenseComponentApi[],
  originalSubcategory: Subcategory | null
): Prisma.ExpenseUpdateInput {
  const components = expense.components.map((c) => c.asApi);
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
    subcategory: {
      ...(expense.subcategory !== null
        ? {
            connect: { id: expense.subcategory.id },
          }
        : originalSubcategory
        ? { delete: true }
        : {}),
    },
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

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: Expense) =>
      trpc.expense.create.mutate(adaptExpenseToCreateInput(expense)),
    onSuccess: (newExpense) => {
      queryClient.setQueryData(
        expensesKeys.all,
        (oldData: ExpenseFromApi[] | undefined) => {
          if (!oldData) return [newExpense];
          return [...oldData, newExpense];
        }
      );
    },
  });
};

export const useAddManyExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenses: Expense[]) => {
      const { ids } = await trpc.expense.createMany.mutate(
        expenses.map(adaptExpenseToCreateManyInput)
      );
      return expenses.map((e, i) => ({
        ...e,
        id: Number(ids[i]),
      }));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: Expense) => {
      const originalExpense = queryClient
        .getQueryData<Expense[]>(expensesKeys.all)
        ?.find((e) => e.id === expense.id);

      if (!originalExpense) {
        throw new Error(`Can't find expense with id ${expense.id}`);
      }

      return trpc.expense.update.mutate({
        id: expense.id,
        data: adaptExpenseToUpdateInput(
          expense,
          originalExpense.components,
          originalExpense.subcategory
        ),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trpc.expense.delete.mutate({ id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expensesKeys.all });
    },
  });
};

export const useDeleteExpenseComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number; expenseId: number }) =>
      trpc.expense.deleteComponent.mutate({ id }),
    onSuccess: (_, { id, expenseId }) => {
      queryClient.setQueryData(
        expensesKeys.all,
        produce((expenses: ExpenseFromApi[]) => {
          const expense = expenses.find((e) => e.id === expenseId);
          if (!expense) {
            return;
          }
          expense.components = expense.components.filter((c) => c.id !== id);
        })
      );
    },
  });
};
