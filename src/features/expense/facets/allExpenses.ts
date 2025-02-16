import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type Category from "~/features/category/Category";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useSubcategoryById } from "~/features/category/facets/subcategoryById";
import type Subcategory from "~/features/category/Subcategory";
import { useSavingSpendingByCategoryId } from "~/features/savingSpending/facets/savingSpendingByCategoryId";
import type SavingSpending from "~/features/savingSpending/SavingSpending";
import type SavingSpendingCategory from "~/features/savingSpending/SavingSpendingCategory";
import { adaptCostFromApi } from "~/features/shared/adapters/adaptCostFromApi";
import { useSourceById } from "~/features/source/facets/sourceById";
import type Source from "~/features/source/Source";
import { useSubscriptionById } from "~/features/subscription/facets/subscriptionById";
import type Subscription from "~/features/subscription/Subscription";
import { expensesQueryParams } from "../api/expensesApi";
import type { ExpenseFromApi } from "../api/types";
import Expense from "../Expense";
import { ExpenseComponent } from "../ExpenseComponent";

function adaptExpenseFromApi(
  expense: ExpenseFromApi,
  category: Category,
  components: ExpenseComponent[],
  subcategory: Subcategory | null,
  source: Source | null,
  subscription: Subscription | null,
  savingSpending: {
    spending: SavingSpending;
    category: SavingSpendingCategory;
  } | null
): Expense {
  return new Expense(
    expense.id,
    adaptCostFromApi(expense.cost, category),
    components,
    dayjs(expense.date),
    category,
    subcategory,
    expense.name,
    source,
    subscription,
    savingSpending,
    expense.actualDate ? dayjs(expense.actualDate) : null,
    expense.peHash
  );
}

export const useExpenses = () => {
  const categoryById = useGetCategoryById();
  const sourceById = useSourceById();
  const subscriptionById = useSubscriptionById();
  const savingSpendingByCategoryId = useSavingSpendingByCategoryId();
  const subcategoryById = useSubcategoryById();

  return useQuery({
    ...expensesQueryParams,
    select: (data) => {
      if (
        !categoryById.loaded ||
        !sourceById.loaded ||
        !subscriptionById.loaded ||
        !savingSpendingByCategoryId.loaded ||
        !subcategoryById.loaded
      ) {
        return;
      }
      return data.map((expense) => {
        const category = categoryById.getCategoryById(expense.categoryId);
        const subcategory =
          expense.subcategoryId === null
            ? null
            : subcategoryById.getSubcategoryById(
                expense.categoryId,
                expense.subcategoryId
              );
        const source =
          expense.sourceId === null
            ? null
            : sourceById.getSourceById(expense.sourceId);
        const subscription =
          expense.subscriptionId === null
            ? null
            : subscriptionById.getSubscriptionById(expense.subscriptionId);
        const savingSpending =
          expense.savingSpendingCategoryId === null
            ? null
            : savingSpendingByCategoryId.getSavingSpendingByCategoryId(
                expense.savingSpendingCategoryId
              );
        const expenseDomainObject = adaptExpenseFromApi(
          expense,
          category,
          [],
          subcategory,
          source,
          subscription,
          savingSpending
        );

        const components = expense.components.map((component) => {
          const componentCategory = categoryById.getCategoryById(
            component.categoryId
          );
          const componentSubcategory =
            component.subcategoryId === null
              ? null
              : subcategoryById.getSubcategoryById(
                  component.categoryId,
                  component.subcategoryId
                );
          return new ExpenseComponent(
            component.id,
            component.name,
            adaptCostFromApi(component.cost, componentCategory),
            componentCategory,
            componentSubcategory,
            expenseDomainObject
          );
        });

        expenseDomainObject.setComponents(components);

        return expenseDomainObject;
      });
    },
  });
};
