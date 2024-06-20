import type Decimal from "decimal.js";
import { type CostCol } from "~/models/Expense";

export default interface AggCostCol extends CostCol {
  diff: Decimal | null;
  isIncome: boolean;
  isContinuous: boolean;
}
