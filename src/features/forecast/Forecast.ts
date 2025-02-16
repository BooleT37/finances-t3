import type Decimal from "decimal.js";
import type Category from "../category/Category";
import type Subcategory from "../category/Subcategory";
import type { ForecastTableItemGroup } from "./types";

export function generateForecastTableId({
  group,
  categoryId,
  subcategoryId,
}: {
  group: ForecastTableItemGroup;
  categoryId: number | null;
  subcategoryId: number | null;
}): string {
  return `${group}-${categoryId ?? "total"}-${subcategoryId ?? "total"}`;
}

export default class Forecast {
  sum: Decimal;
  month: number;
  year: number;
  category: Category;
  subcategory: Subcategory | null;
  comment: string | null;

  constructor(
    category: Category,
    subcategory: Subcategory | null,
    month: number,
    year: number,
    sum: Decimal,
    comment: string | null = null
  ) {
    this.category = category;
    this.subcategory = subcategory;
    this.month = month;
    this.year = year;
    this.sum = sum;
    this.comment = comment;
  }

  get subcategoryId(): number | null {
    return this.subcategory?.id ?? null;
  }

  private get previousMonthAndYear(): { month: number; year: number } {
    if (this.month === 0) {
      return {
        month: 11,
        year: this.year - 1,
      };
    }
    return {
      month: this.month - 1,
      year: this.year,
    };
  }

  get previousMonth() {
    return this.previousMonthAndYear.month;
  }

  get previousYear() {
    return this.previousMonthAndYear.year;
  }
}
