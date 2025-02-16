import { type Category as ApiCategory, type Prisma } from "@prisma/client";
import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from "@tanstack/react-query";
import { isEqual } from "lodash";
import { trpc } from "~/utils/api";
import { isTempId } from "~/utils/tempId";
import type Category from "../Category";
import type { CategoryTableItem } from "../Category";
import type Subcategory from "../Subcategory";

export const categoriesKeys = {
  all: ["categories"] as const,
};

export const categoriesQueryParams = {
  queryKey: categoriesKeys.all,
  queryFn: () => trpc.categories.getAll.query(),
} as const;

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
): Prisma.CategoryUpdateWithoutUserInput => ({
  name: category.name,
  shortname: category.shortname,
  icon: category.icon,
  type: category.type,
  isContinuous: category.isContinuous,
  isIncome: category.isIncome,
  subcategories: adaptSubcategoriesToUpdateInput(
    category.subcategories,
    currentCategory.subcategories
  ),
});

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Category) => {
      const currentCategory = queryClient
        .getQueryData<Category[]>(categoriesKeys.all)
        ?.find((c) => c.id === category.id);

      if (!currentCategory) {
        throw new Error(`Category with id ${category.id} not found`);
      }

      return trpc.categories.update.mutate({
        data: adaptCategoryToUpdateInput(category, currentCategory),
        id: category.id,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
};

export const useUpdateCategoryField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (({
      id,
      field,
      value,
    }: {
      id: number;
      field: keyof CategoryTableItem;
      value: CategoryTableItem[keyof CategoryTableItem];
    }) =>
      trpc.categories.update.mutate({
        data: { [field]: value },
        id,
      })) as MutationFunction<
      ApiCategory,
      {
        id: number;
        field: keyof CategoryTableItem;
        value: CategoryTableItem[keyof CategoryTableItem];
      }
    >,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Category) =>
      trpc.categories.create.mutate({
        name: category.name,
        shortname: category.shortname,
        icon: category.icon,
        isContinuous: category.isContinuous,
        isIncome: category.isIncome,
        type: category.type,
        subcategories: {
          createMany: {
            data: category.subcategories.map((subcategory) => ({
              name: subcategory.name,
            })),
          },
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => trpc.categories.delete.mutate({ id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
};
