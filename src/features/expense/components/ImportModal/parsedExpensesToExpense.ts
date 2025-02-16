import Decimal from "decimal.js";
import type Category from "~/features/category/Category";
import type Subcategory from "~/features/category/Subcategory";
import Expense from "~/features/expense/Expense";
import type Source from "~/features/source/Source";
import type { ValidatedParsedExpenseFormValue } from "./ParsedExpensesModal";

export const parsedExpenseFormValueToExpense = (
  parsedExpense: ValidatedParsedExpenseFormValue,
  source: Source,
  category: Category,
  subcategory: Subcategory | null
): Expense =>
  new Expense(
    -1,
    new Decimal(parsedExpense.amount).abs(),
    [],
    parsedExpense.date,
    category,
    subcategory,
    parsedExpense.description,
    source,
    null,
    null,
    null,
    parsedExpense.hash
  );
