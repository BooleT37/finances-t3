import { sortAllCategories } from "~/stores/categoriesOrder";
import categoriesStore from "~/stores/categoriesStore";
import userSettingsStore from "~/stores/userSettingsStore";

export const sortAllCategoriesByName = (
  category1Name: string,
  category2Name: string
) => {
  return sortAllCategories(
    categoriesStore.getByName(category1Name).id,
    categoriesStore.getByName(category2Name).id,
    userSettingsStore.expenseCategoriesOrder,
    userSettingsStore.incomeCategoriesOrder
  );
};
