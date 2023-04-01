import { type Prisma } from "@prisma/client";
import type NewSavingSpendingCategory from "~/models/NewSavingSpendingCategory";
import type SavingSpendingEditing from "~/models/SavingSpendingEditing";

function adaptNewSavingSpendingCategoryToCreateManyInput(
  category: NewSavingSpendingCategory
): Prisma.SavingSpendingCategoryCreateManySavingSpendingInput {
  return {
    name: category.name,
    forecast: category.forecast,
    comment: category.comment,
  };
}

export function adaptSavingSpendingToCreateInput(
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

export function adaptSavingSpendingToUpdateInput(
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
