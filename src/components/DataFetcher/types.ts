import type { Categories } from "~/readonlyStores/categories";
import type { Sources } from "~/readonlyStores/sources";
import type { ExpenseStore } from "~/stores/expenseStore";
import type { ForecastStore } from "~/stores/forecastStore";
import type { SavingSpendingStore } from "~/stores/savingSpendingStore";
import type { SubscriptionStore } from "~/stores/subscriptionStore";

export interface Stores {
  categoriesStore: Categories | false;
  sourcesStore: Sources | false;
  forecastStore: ForecastStore | false;
  subscriptionStore: SubscriptionStore | false;
  savingSpendingStore: SavingSpendingStore | false;
  expenseStore: ExpenseStore | false;
}
