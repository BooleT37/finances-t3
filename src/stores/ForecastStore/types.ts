import type { CategoryType } from "@prisma/client";
import type Decimal from "decimal.js";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";

export interface MonthSpendings {
  spendings: Decimal;
  diff: Decimal;
  isIncome: boolean;
}

export type ForecastTableItemGroup =
  | "expense"
  | "savings"
  | "personal"
  | "income";

export interface ForecastTableItem {
  group: ForecastTableItemGroup;
  category: string;
  categoryId: number;
  categoryShortname: string;
  categoryType: CategoryType | null;
  average: Decimal;
  monthsWithSpendings: string;
  lastMonth: MonthSpendings;
  thisMonth: MonthSpendings;
  sum: Decimal | null;
  subscriptions: ForecastSubscriptionsItem[];
  comment: string;
}
