import type { CategoryType } from "@prisma/client";
import type Decimal from "decimal.js";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";

export interface MonthSpendings {
  spendings: Decimal;
  diff: Decimal;
  isIncome: boolean;
}

export interface ForecastSum {
  value: Decimal | null;
  subscriptions: ForecastSubscriptionsItem[];
}

export interface ForecastTableItem {
  category: string;
  categoryId: number;
  categoryShortname: string;
  categoryType: CategoryType | null;
  average: Decimal;
  monthsWithSpendings: string;
  lastMonth: MonthSpendings;
  thisMonth: MonthSpendings;
  sum: ForecastSum;
  comment: string;
}
