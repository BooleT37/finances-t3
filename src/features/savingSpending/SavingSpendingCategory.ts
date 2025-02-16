import type Decimal from "decimal.js";
import type { Option } from "~/types";
import type NewSavingSpendingCategory from "./NewSavingSpendingCategory";

export default class SavingSpendingCategory
  implements NewSavingSpendingCategory
{
  id: number;
  name: string;
  forecast: Decimal;
  comment: string;

  constructor(id: number, name: string, forecast: Decimal, comment: string) {
    this.id = id;
    this.name = name;
    this.forecast = forecast;
    this.comment = comment;
  }

  isSame(anotherCategory: SavingSpendingCategory) {
    return (
      this.id === anotherCategory.id &&
      this.name === anotherCategory.name &&
      this.forecast === anotherCategory.forecast &&
      this.comment === anotherCategory.comment
    );
  }

  get asOption(): Option {
    return {
      value: this.id,
      label: this.name,
    };
  }
}
