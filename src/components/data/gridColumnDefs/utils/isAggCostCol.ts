import { type CostCol } from "~/models/Expense";
import { type AggCostCol } from "~/types/data";

export default function isAggCostCol(
  costCol: CostCol | AggCostCol
): costCol is AggCostCol {
  return "diff" in costCol;
}
