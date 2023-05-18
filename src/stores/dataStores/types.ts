import type CategoriesStore from "~/stores/CategoriesStore";
import type ExpenseStore from "~/stores/ExpenseStore";
import type ForecastStore from "~/stores/ForecastStore";
import type SavingSpendingStore from "~/stores/SavingSpendingStore";
import type SourcesStore from "~/stores/SourcesStore";
import type SubscriptionStore from "~/stores/SubscriptionStore";
import type UserSettingsStore from "~/stores/UserSettingsStore";

export interface DataLoader<TData = unknown> {
  inited: boolean;
  loadData(): Promise<TData | undefined>;
  init(data: TData): void;
}

export interface Stores {
  categoriesStore: CategoriesStore;
  sourcesStore: SourcesStore;
  forecastStore: ForecastStore;
  subscriptionStore: SubscriptionStore;
  savingSpendingStore: SavingSpendingStore;
  expenseStore: ExpenseStore;
  userSettingsStore: UserSettingsStore;
}

export interface StoresClasses {
  CategoriesStore: typeof CategoriesStore;
  SourcesStore: typeof SourcesStore;
  ForecastStore: typeof ForecastStore;
  SubscriptionStore: typeof SubscriptionStore;
  SavingSpendingStore: typeof SavingSpendingStore;
  ExpenseStore: typeof ExpenseStore;
  UserSettingsStore: typeof UserSettingsStore;
}
