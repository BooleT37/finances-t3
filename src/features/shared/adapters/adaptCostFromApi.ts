import type Decimal from "decimal.js";
import type Category from "~/features/category/Category";

export const adaptCostFromApi = (cost: Decimal, category: Category) =>
  category.isIncome || cost.eq(0) ? cost : cost.abs().negated();
