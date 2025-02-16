import type { ParsedExpenseFromApi } from "~/features/parsedExpense/api/types";

export interface ExpensesParser {
  parse(): Promise<ParsedExpenseFromApi[]>;
}
