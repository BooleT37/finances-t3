import { PdfDataParser } from "pdf-data-parser";
import type PdfDataParserType from "pdf-data-parser/types/PdfDataParser";
import type { ParsedExpenseFromApi } from "~/features/parsedExpense/api/types";
import { hash } from "../hash";
import type { ExpensesParser } from "./ExpensesParser";

const ROWS_TO_SKIP_AT_START = 6;
const ROWS_TO_SKIP_AT_END = 4;

const matchAmount = (amount: string) =>
  /(?<sign>-?)EUR(?<amount>\d+(?:,\d+)?\.\d+)/.exec(amount);

const parseAmount = (amount: string): string => {
  const matched = matchAmount(amount);
  if (!matched?.groups) {
    throw new Error(`Failed to parse amount: ${amount}`);
  }
  return `${matched.groups.sign}${matched.groups.amount?.replaceAll(",", "")}`;
};

const validRow = (row: string[]): boolean =>
  (row.length === 5 || row.length === 4 || row.length === 3) &&
  !row[0]?.startsWith("Booking Date");

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
          const nextRow = array[index + 1];
          // new format
          if (
            nextRow &&
            nextRow.length === 2 &&
            nextRow[0] &&
            matchAmount(nextRow[0])
          ) {
            if (!nextRow[0]) {
              throw new Error(`Invalid row: ${row.join(", ")}`);
            }
            const expense: Omit<ParsedExpenseFromApi, "hash"> = {
              date: row[0],
              type: row[1],
              description: `${row[2]} ${array[index + 2]?.[0]}`,
              amount: parseAmount(nextRow[0]),
            };

            return {
              ...expense,
              hash: hash(expense),
            };
          } else {
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
