import { action } from "mobx";
import { dataStores } from "./dataStores";

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

export const sortAllCategoriesByName = action(
  (category1Name: string, category2Name: string) => {
    return sortAllCategories(
      dataStores.categoriesStore.getByName(category1Name).id,
      dataStores.categoriesStore.getByName(category2Name).id,
      dataStores.userSettingsStore.expenseCategoriesOrder,
      dataStores.userSettingsStore.incomeCategoriesOrder
    );
  }
);
