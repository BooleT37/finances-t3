import Decimal from "decimal.js";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useSubcategoryById } from "~/features/category/facets/subcategoryById";
import Expense from "~/features/expense/Expense";
import { useSavingSpendingByCategoryId } from "~/features/savingSpending/facets/savingSpendingByCategoryId";
import { useSourceById } from "~/features/source/facets/sourceById";
import { useSubscriptionById } from "~/features/subscription/facets/subscriptionById";
import type { ValidatedFormValues } from "./models";

export function useAdaptExpenseFromFormValues() {
  const categoryById = useGetCategoryById();
  const sourceById = useSourceById();
  const subscriptionById = useSubscriptionById();
  const savingSpendingByCategoryId = useSavingSpendingByCategoryId();
  const subcategoryById = useSubcategoryById();

  return (values: ValidatedFormValues): Expense => {
    if (
      !categoryById.loaded ||
      !sourceById.loaded ||
      !subscriptionById.loaded ||
      !savingSpendingByCategoryId.loaded ||
      !subcategoryById.loaded
    ) {
      throw new Error(
        "Cannot adapt expense from form values: not all entities are loaded"
      );
    }
    const category = categoryById.getCategoryById(values.category);
    const subcategory =
      values.subcategory !== undefined
        ? subcategoryById.getSubcategoryById(
            values.category,
            values.subcategory
          )
        : null;
    const source =
      values.source !== undefined
        ? sourceById.getSourceById(values.source)
        : null;
    const subscription =
      values.subscription !== undefined
        ? subscriptionById.getSubscriptionById(values.subscription)
        : null;
    const savingSpending =
      values.savingSpendingCategoryId !== undefined
        ? savingSpendingByCategoryId.getSavingSpendingByCategoryId(
            values.savingSpendingCategoryId
          )
        : null;

    return new Expense(
      -1, // id will be set later if needed
      new Decimal(values.cost),
      [], // components will be set separately
      values.date,
      category,
      subcategory,
      values.name,
      source,
      subscription,
      savingSpending,
      values.actualDate ?? null,
      null // parsed expense hash only makes sense for imported expenses
    );
  };
}
