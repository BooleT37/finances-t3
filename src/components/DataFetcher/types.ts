import type { Sources } from "~/readonlyStores/sources";
import type { CategoriesStore } from "~/stores/categoriesStore";
import type { ExpenseStore } from "~/stores/expenseStore";
import type { ForecastStore } from "~/stores/forecastStore";
import type { SavingSpendingStore } from "~/stores/savingSpendingStore";
import type { SubscriptionStore } from "~/stores/subscriptionStore";
import type { UserSettingsStore } from "~/stores/userSettingsStore";

export interface Stores {
  categoriesStore: CategoriesStore | false;
  sourcesStore: Sources | false;
  forecastStore: ForecastStore | false;
  subscriptionStore: SubscriptionStore | false;
  savingSpendingStore: SavingSpendingStore | false;
  expenseStore: ExpenseStore | false;
  userSettingsStore: UserSettingsStore | false;
}
