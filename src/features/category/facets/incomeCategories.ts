import { useMemo } from "react";
import { useIncomeCategoriesOrder } from "~/features/userSettings/facets/categoriesOrder";
import { useCategories } from "./allCategories";
import { sortCategories } from "./categoriesOrder";

export const useIncomeCategories = () => {
  const { data: categories } = useCategories();
  const incomeCategoriesOrder = useIncomeCategoriesOrder();

  return useMemo(
    () =>
      incomeCategoriesOrder
        ? categories
            ?.filter((c) => c.isIncome)
            .sort((c1, c2) =>
              sortCategories(c1.id, c2.id, incomeCategoriesOrder)
            )
        : [],
    [categories, incomeCategoriesOrder]
  );
};
