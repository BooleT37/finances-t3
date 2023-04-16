import type { CategoriesStore } from "~/stores/categoriesStore";
import type { ExpenseStore } from "~/stores/expenseStore";
import type { ForecastStore } from "~/stores/forecastStore";
import type { SavingSpendingStore } from "~/stores/savingSpendingStore";
import type { SourcesStore } from "~/stores/sourcesStore";
import type { SubscriptionStore } from "~/stores/subscriptionStore";
import type { UserSettingsStore } from "~/stores/userSettingsStore";

export interface Stores {
  categoriesStore: CategoriesStore | false;
  sourcesStore: SourcesStore | false;
  forecastStore: ForecastStore | false;
  subscriptionStore: SubscriptionStore | false;
  savingSpendingStore: SavingSpendingStore | false;
  expenseStore: ExpenseStore | false;
  userSettingsStore: UserSettingsStore | false;
}
