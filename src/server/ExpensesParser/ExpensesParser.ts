import type { ParsedExpenseFromApi } from "~/models/ParsedExpense";

export interface ExpensesParser {
  parse(): Promise<ParsedExpenseFromApi[]>;
}
