import type { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import type NewSavingSpendingCategory from "../NewSavingSpendingCategory";
import type SavingSpendingEditing from "../SavingSpendingEditing";

export const savingSpendingKeys = {
  all: ["savingSpending"] as const,
};

export const savingSpendingQueryParams = {
  queryKey: savingSpendingKeys.all,
  queryFn: () => trpc.savingSpending.getAll.query(),
} as const;

function adaptNewSavingSpendingCategoryToCreateManyInput(
  category: NewSavingSpendingCategory
): Prisma.SavingSpendingCategoryCreateManySavingSpendingInput {
  return {
    name: category.name,
    forecast: category.forecast,
    comment: category.comment,
  };
}

function adaptSavingSpendingToCreateInput(
  savingSpending: SavingSpendingEditing
): Prisma.SavingSpendingCreateInput {
  return {
    name: savingSpending.name,
    completed: false,
    categories: {
      createMany: {
        data: savingSpending.categories.map(
          adaptNewSavingSpendingCategoryToCreateManyInput
        ),
      },
    },
  };
}

export const useAddSavingSpending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (spending: SavingSpendingEditing) =>
      trpc.savingSpending.create.mutate(
        adaptSavingSpendingToCreateInput(spending)
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: savingSpendingKeys.all });
    },
  });
};

function adaptSavingSpendingToUpdateInput(
  savingSpending: SavingSpendingEditing
): Prisma.SavingSpendingUpdateInput {
  const { newCategories, editedCategories, removedCategories } = savingSpending;
  return {
    name: savingSpending.name,
    categories: {
      createMany: {
        data: newCategories.map(
          adaptNewSavingSpendingCategoryToCreateManyInput
        ),
      },
      update: editedCategories.map((category) => ({
        data: {
          name: category.name,
          forecast: category.forecast,
          comment: category.comment,
        },
        where: {
          id: category.id,
        },
      })),
      deleteMany: {
        id: {
          in: removedCategories.map((c) => c.id),
        },
      },
    },
  };
}

export const useUpdateSavingSpending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (spending: SavingSpendingEditing) =>
      trpc.savingSpending.update.mutate({
        data: adaptSavingSpendingToUpdateInput(spending),
        id: spending.id,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: savingSpendingKeys.all });
    },
  });
};

export const useDeleteSavingSpending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => trpc.savingSpending.delete.mutate({ id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: savingSpendingKeys.all });
    },
  });
};
