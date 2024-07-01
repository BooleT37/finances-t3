import type Decimal from "decimal.js";

export interface RecordType {
  id: string;
  name: string;
  forecast: Decimal;
  expenses: Decimal;
}
