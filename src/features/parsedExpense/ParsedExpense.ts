import type { Dayjs } from "dayjs";
import type Decimal from "decimal.js";

export interface ParsedExpense {
  date: Dayjs;
  type: string;
  description: string;
  amount: Decimal;
  hash: string;
}
