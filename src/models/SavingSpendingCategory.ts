import { sum } from "lodash";
import { makeAutoObservable } from "mobx";
import type { RecordType } from "~/types/savingSpending/RecordType";
import type { Option } from "~/types/types";
import roundCost from "~/utils/roundCost";
import expenseStore from "../stores/expenseStore";
import NewSavingSpendingCategory from "./NewSavingSpendingCategory";

export default class SavingSpendingCategory extends NewSavingSpendingCategory {
  id: number;

  constructor(id: number, name: string, forecast: number, comment: string) {
    super(name, forecast, comment);
    makeAutoObservable(this);

    this.id = id;
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
    return roundCost(
      sum(
        expenseStore.expenses
          .filter(
            (e) => e.savingSpending && e.savingSpending.category.id === this.id
          )
          .map((e) => e.cost ?? 0)
      )
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
