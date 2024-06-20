import { makeAutoObservable } from "mobx";
import type { FormValues } from "~/components/CostsListModal/CostsListForm";
import type SavingSpending from "~/models/SavingSpending";

class SavingSpendingModalViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  savingSpendingToFormValues(savingSpending: SavingSpending): FormValues {
    return {
      name: savingSpending.name,
      costs: savingSpending.categories.map((c) => ({
        comment: c.comment,
        sum: c.forecast.toNumber(),
        name: c.name,
        id: c.id,
      })),
    };
  }
}

export const savingSpendingModalViewModel = new SavingSpendingModalViewModel();
