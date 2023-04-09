import { sortAllCategories } from "~/stores/categoriesOrder";
import categoriesStore from "~/stores/categoriesStore";

export const sortAllCategoriesByName = (
  category1Name: string,
  category2Name: string
) => {
  return sortAllCategories(
    categoriesStore.getByName(category1Name).shortname,
    categoriesStore.getByName(category2Name).shortname
  );
};
