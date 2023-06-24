import { type Prisma } from "@prisma/client";
import { isEqual } from "lodash";
import type Category from "~/models/Category";
import type Subcategory from "~/models/Subcategory";
import { isTempId } from "~/utils/tempId";

const adaptSubcategoryToCreateManyInput = (
  subcategory: Subcategory
): Prisma.SubcategoryCreateManyCategoryInput => ({
  name: subcategory.name,
});

const getChangedSubcategories = (
  subcategories: Subcategory[],
  currentSubcategories: Subcategory[]
): Subcategory[] =>
  subcategories.filter((s) => {
    if (isTempId(s.id)) {
      return false;
    }
    const currentSubcategory = currentSubcategories.find(
      (cs) => cs.id === s.id
    );
    if (!currentSubcategory) {
      throw new Error(
        `Can't update subcategory ${s.name}: can't find it in the subcategories list`
      );
    }
    return !isEqual(s, currentSubcategory);
  });

const adaptSubcategoriesToUpdateInput = (
  subcategories: Subcategory[],
  currentSubcategories: Subcategory[]
): Prisma.SubcategoryUpdateManyWithoutCategoryNestedInput => ({
  createMany: {
    data: subcategories
      .filter((s) => isTempId(s.id))
      .map(adaptSubcategoryToCreateManyInput),
  },
  update: getChangedSubcategories(subcategories, currentSubcategories).map(
    (s) => ({
      data: {
        name: s.name,
      },
      where: {
        id: s.id,
      },
    })
  ),
  deleteMany: {
    id: {
      in: currentSubcategories
        .filter((cs) => subcategories.every((s) => s.id !== cs.id))
        .map((cs) => cs.id),
    },
  },
});

export const adaptCategoryToUpdateInput = (
  category: Category,
  currentCategory: Category
): Prisma.CategoryUpdateWithoutUserInput => {
  return {
    name: category.name,
    shortname: category.shortname,
    type: category.type,
    isContinuous: category.isContinuous,
    isIncome: category.isIncome,
    subcategories: adaptSubcategoriesToUpdateInput(
      category.subcategories,
      currentCategory.subcategories
    ),
  };
};
