import type Decimal from "decimal.js";
import { makeAutoObservable } from "mobx";
import { dataStores } from "~/stores/dataStores";
import type { RecordType } from "~/types/savingSpending/RecordType";
import type { Option } from "~/types/types";
import { decimalSum } from "~/utils/decimalSum";
import type NewSavingSpendingCategory from "./NewSavingSpendingCategory";

export default class SavingSpendingCategory
  implements NewSavingSpendingCategory
{
  id: number;
  name: string;
  forecast: Decimal;
  comment: string;

  constructor(id: number, name: string, forecast: Decimal, comment: string) {
    makeAutoObservable(this);

    this.id = id;
    this.name = name;
    this.forecast = forecast;
    this.comment = comment;
  }

  get asTableRecord(): RecordType {
    return {
      id: String(this.id),
      expenses: this.expenses,
      forecast: this.forecast,
      name: this.name,
    };
  }

  get expenses() {
    return decimalSum(
      ...dataStores.expenseStore.expenses
        .filter(
          (e) => e.savingSpending && e.savingSpending.category.id === this.id
        )
        .map((e) => e.cost ?? 0)
    );
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
