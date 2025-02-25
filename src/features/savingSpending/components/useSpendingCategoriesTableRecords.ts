import { useExpenses } from "~/features/expense/facets/allExpenses";
import type SavingSpending from "~/features/savingSpending/SavingSpending";
import { decimalSum } from "~/utils/decimalSum";

export function useSpendingCategoriesTableRecords(spending: SavingSpending) {
  const { data: allExpenses = [] } = useExpenses();
  return spending.categories.map((category) => {
    const expenses = decimalSum(
      ...allExpenses
        .filter(
          (e) =>
            e.savingSpending && e.savingSpending.category.id === category.id
        )
        .map((e) => e.cost.abs())
    );
    return {
      id: String(category.id),
      expenses,
      forecast: category.forecast,
      name: category.name,
    };
  });
}
