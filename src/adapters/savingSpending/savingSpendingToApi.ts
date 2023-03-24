import { type Prisma } from "@prisma/client";
import NewSavingSpendingCategory from "~/models/NewSavingSpendingCategory";
import SavingSpendingCategory from "~/models/SavingSpendingCategory";
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
  const { categories } = savingSpending;
  const newCategories = categories.filter(
    (c): c is NewSavingSpendingCategory =>
      c instanceof NewSavingSpendingCategory
  );
  const oldCategories = categories.filter(
    (c): c is SavingSpendingCategory => c instanceof SavingSpendingCategory
  );
  return {
    name: savingSpending.name,
    completed: savingSpending.completed,
    categories: {
      createMany: {
        data: newCategories.map(
          adaptNewSavingSpendingCategoryToCreateManyInput
        ),
      },
      update: oldCategories.map((category) => ({
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
          // TODO check, will it also remove just created categories??
          notIn: oldCategories.map((c) => c.id),
        },
      },
    },
  };
}
