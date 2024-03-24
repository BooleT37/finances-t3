import { action } from "mobx";
import { sortAllCategories } from "~/stores/categoriesOrder";
import { dataStores } from "~/stores/dataStores";

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
