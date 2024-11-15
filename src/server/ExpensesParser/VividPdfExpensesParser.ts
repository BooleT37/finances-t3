import { PdfDataParser } from "pdf-data-parser";
import type PdfDataParserType from "pdf-data-parser/types/PdfDataParser";
import type { ParsedExpenseFromApi } from "~/models/ParsedExpense";
import type { ExpensesParser } from "./ExpensesParser";
import { hash } from "../hash";

const ROWS_TO_SKIP_AT_START = 6;
const ROWS_TO_SKIP_AT_END = 4;

const parseAmount = (amount: string): string => {
  const matched = /(?<sign>-?)EUR(?<amount>\d+\.\d+)/.exec(amount);
  if (!matched?.groups) {
    throw new Error(`Failed to parse amount: ${amount}`);
  }
  return `${matched.groups.sign}${matched.groups.amount}`;
};

const validRow = (row: string[]): boolean => {
  return (row.length === 4 || row.length === 3) && row[0] !== "Booking Date";
};

export class VividPdfExpensesParser implements ExpensesParser {
  private parser: PdfDataParserType;
  constructor(url: string) {
    this.parser = new PdfDataParser({
      url,
      repeatingHeaders: true,
    });
  }

  async parse(): Promise<ParsedExpenseFromApi[]> {
    const rows = await this.parser.parse();
    if (!rows) {
      throw new Error("No rows found in the PDF");
    }
    return rows
      .slice(ROWS_TO_SKIP_AT_START, -ROWS_TO_SKIP_AT_END)
      .map((row: string[], index: number, array: string[][]) => {
        if (!validRow(row)) {
          return null;
        }
        if (!row[0] || !row[1] || !row[2]) {
          throw new Error(`Invalid row: ${row.join(", ")}`);
        }
        if (row.length === 3 && row[1] === "Transfer between own accounts") {
          const expense: Omit<ParsedExpenseFromApi, "hash"> = {
            date: row[0],
            type: row[1],
            description: `${array[index - 1]?.[0]} ${array[index + 1]?.[0]}`,
            amount: parseAmount(row[2]),
          };

          return {
            ...expense,
            hash: hash(expense),
          };
        }
        if (!row[3]) {
          throw new Error(`Invalid row: ${row.join(", ")}`);
        }
        const expense: Omit<ParsedExpenseFromApi, "hash"> = {
          date: row[0],
          type: row[1],
          description: row[2],
          amount: parseAmount(row[3]),
        };
        return {
          ...expense,
          hash: hash(expense),
        };
      })
      .filter((row) => row !== null);
  }
}
