import Decimal from "decimal.js";
import { parseCategorySubcategoryId } from "~/components/categories/categorySubcategoryId";
import Expense from "~/models/Expense";
import type Source from "~/models/Source";
import { dataStores } from "~/stores/dataStores";
import type { ValidatedParsedExpenseFormValue } from "./ParsedExpensesModal";

export const parsedExpenseFormValueToExpense = (
  parsedExpense: ValidatedParsedExpenseFormValue,
  source: Source
): Expense => {
  const { categoryId, subcategoryId } = parseCategorySubcategoryId(
    parsedExpense.categorySubcategoryId
  );
  return new Expense(
    -1,
    new Decimal(parsedExpense.amount).abs(),
    [],
    parsedExpense.date,
    dataStores.categoriesStore.getById(categoryId),
    subcategoryId !== null
      ? dataStores.categoriesStore.getSubcategoryById(categoryId, subcategoryId)
      : null,
    parsedExpense.description,
    source,
    null,
    null,
    parsedExpense.date,
    parsedExpense.hash
  );
};
