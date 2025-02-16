import type { Dayjs } from "dayjs";
import type { Decimal } from "decimal.js";
import type Category from "~/features/category/Category";
import type Subcategory from "~/features/category/Subcategory";
import { useExpenses } from "./allExpenses";

interface ExpenseOrComponent {
  name: string;
  cost: Decimal;
  date: Dayjs;
  category: Category;
  subcategory: Subcategory | null;
  subcategoryId: number | null;
}

export const useExpensesAndComponents = () => {
  const { data: expenses } = useExpenses();
  return expenses
    ?.map<ExpenseOrComponent>(
      ({
        costWithoutComponents,
        date,
        name,
        category,
        subcategory,
        subcategoryId,
      }) => ({
        cost: costWithoutComponents,
        date,
        name,
        category,
        subcategory,
        subcategoryId,
      })
    )
    .concat(
      expenses.flatMap((e) =>
        e.components.map(
          ({
            cost,
            parentExpense,
            name,
            category,
            subcategory,
            subcategoryId,
          }) => ({
            cost,
            date: parentExpense.date,
            name,
            category,
            subcategory,
            subcategoryId,
          })
        )
      )
    );
};
