import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";

export interface MonthSpendings {
  spendings: number;
  diff: number;
  isIncome: boolean;
}

export interface ForecastSum {
  value: number | null;
  subscriptions: ForecastSubscriptionsItem[];
}

export interface ForecastTableItem {
  category: string;
  categoryId: number;
  categoryShortname: string;
  average: number;
  monthsWithSpendings: string;
  lastMonth: MonthSpendings;
  thisMonth: MonthSpendings;
  sum: ForecastSum;
  comment: string;
}
