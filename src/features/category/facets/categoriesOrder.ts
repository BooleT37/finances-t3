import { useCallback } from "react";
import {
  useExpenseCategoriesOrder,
  useIncomeCategoriesOrder,
} from "~/features/userSettings/facets/categoriesOrder";
import { useGetCategoryById } from "./categoryById";

export const sortCategories = (
  category1id: number,
  category2Id: number,
  order: number[]
) => {
  if (!order.includes(category1id)) {
    console.error(
      `Не найдено место в сортировке для категории с id ${category1id}.`
    );
  }
  if (!order.includes(category2Id)) {
    console.error(
      `Не найдено место в сортировке для категории с id ${category2Id}.`
    );
  }
  return order.indexOf(category1id) - order.indexOf(category2Id);
};

export const sortAllCategories = (
  category1Id: number,
  category2Id: number,
  expenseCategoriesOrder: number[],
  incomeCategoriesOrder: number[]
) =>
  sortCategories(category1Id, category2Id, [
    ...expenseCategoriesOrder,
    ...incomeCategoriesOrder,
  ]);

export const useSortAllCategoriesById = () => {
  const expenseCategoriesOrder = useExpenseCategoriesOrder();
  const incomeCategoriesOrder = useIncomeCategoriesOrder();
  return useCallback(
    (category1Id: number, category2Id: number) =>
      expenseCategoriesOrder && incomeCategoriesOrder
        ? sortAllCategories(
            category1Id,
            category2Id,
            expenseCategoriesOrder,
            incomeCategoriesOrder
          )
        : 0,
    [expenseCategoriesOrder, incomeCategoriesOrder]
  );
};

export const useSortSubcategories = () => {
  const categoryById = useGetCategoryById();
  return useCallback(
    (
      categoryId: number,
      subcategory1Id: number | null,
      subcategory2Id: number | null
    ) => {
      if (!categoryById.loaded) {
        return 0;
      }
      const category = categoryById.getCategoryById(categoryId);
      const subcategories = category.subcategories;
      if (subcategory1Id === null) {
        return 1;
      }
      if (subcategory2Id === null) {
        return -1;
      }
      const subcategoriesOrder = subcategories.map(
        (subcategory) => subcategory.id
      );
      if (!subcategoriesOrder.includes(subcategory1Id)) {
        console.error(
          `Не найдено место в сортировке для подкатегории с id ${subcategory1Id}.`
        );
      }
      if (!subcategoriesOrder.includes(subcategory2Id)) {
        console.error(
          `Не найдено место в сортировке для подкатегории с id ${subcategory2Id}.`
        );
      }
      return (
        subcategoriesOrder.indexOf(subcategory1Id) -
        subcategoriesOrder.indexOf(subcategory2Id)
      );
    },
    [categoryById]
  );
};
