import { useMemo } from "react";
import { useExpenseCategoriesOrder } from "~/features/userSettings/facets/categoriesOrder";
import { useCategories } from "./allCategories";
import { sortCategories } from "./categoriesOrder";

export const useExpenseCategories = () => {
  const { data: categories } = useCategories();
  const expenseCategoriesOrder = useExpenseCategoriesOrder();

  return useMemo(
    () =>
      expenseCategoriesOrder
        ? categories
            ?.filter((c) => !c.isIncome)
            .sort((c1, c2) =>
              sortCategories(c1.id, c2.id, expenseCategoriesOrder)
            )
        : [],
    [categories, expenseCategoriesOrder]
  );
};
