import type { CategoryType } from "@prisma/client";
import type Decimal from "decimal.js";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";

export interface MonthSpendings {
  spendings: Decimal;
  diff: Decimal;
}

export type ForecastTableItemGroup = "expense" | "savings" | "income" | "total";

export interface ForecastTableItem {
  tableId: string;
  group: ForecastTableItemGroup;
  name: string;
  icon: string | null;
  categoryId: number | null;
  categoryType: CategoryType | null;
  subcategoryId: number | null;
  average: Decimal;
  monthsWithSpendings: string;
  lastMonth: MonthSpendings;
  thisMonth: MonthSpendings;
  sum: Decimal | null;
  subscriptions: ForecastSubscriptionsItem[];
  comment: string;
  isFake?: boolean;
  isRestRow?: boolean;
  subRows?: ForecastTableItem[];
}
