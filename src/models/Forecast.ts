import type Decimal from "decimal.js";
import { makeAutoObservable } from "mobx";
import type { ForecastTableItemGroup } from "~/stores/ForecastStore/types";
import type Category from "./Category";
import type Subcategory from "./Subcategory";

type ForecastTableItemId =
  | `${ForecastTableItemGroup}`
  | `${ForecastTableItemGroup}-${number}`
  | `${ForecastTableItemGroup}-${number}-${number}`;

export function generateForecastTableId({
  group,
  categoryId,
  subcategoryId,
}: {
  group: ForecastTableItemGroup;
  categoryId: number | null;
  subcategoryId: number | null;
}): ForecastTableItemId {
  if (categoryId === null) {
    return group;
  }
  if (subcategoryId === null) {
    return `${group}-${categoryId}`;
  }
  return `${group}-${categoryId}-${subcategoryId}`;
}

class Forecast {
  constructor(
    public category: Category,
    public subcategory: Subcategory | null,
    public month: number,
    public year: number,
    public sum: Decimal,
    public comment: string
  ) {
    makeAutoObservable(this);
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

  // important to use this getter wherever possible
  // because subcategory?.id returns undefined (not null) if subcategory is null
  get subcategoryId() {
    return this.subcategory?.id ?? null;
  }

  get previousMonth() {
    return this.previousMonthAndYear.month;
  }

  get previousYear() {
    return this.previousMonthAndYear.year;
  }
}

export default Forecast;
