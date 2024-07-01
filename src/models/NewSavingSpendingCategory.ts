import type Decimal from "decimal.js";

export default interface NewSavingSpendingCategory {
  name: string;
  forecast: Decimal;
  comment: string;
}
