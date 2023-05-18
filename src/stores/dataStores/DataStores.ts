import { dataStoresStateStore } from "./DataStoresStateStore";
import type { Stores } from "./types";

class DataStores implements Stores {
  get categoriesStore() {
    return dataStoresStateStore.getStore("categoriesStore");
  }

  get sourcesStore() {
    return dataStoresStateStore.getStore("sourcesStore");
  }

  get forecastStore() {
    return dataStoresStateStore.getStore("forecastStore");
  }

  get subscriptionStore() {
    return dataStoresStateStore.getStore("subscriptionStore");
  }

  get savingSpendingStore() {
    return dataStoresStateStore.getStore("savingSpendingStore");
  }

  get expenseStore() {
    return dataStoresStateStore.getStore("expenseStore");
  }

  get userSettingsStore() {
    return dataStoresStateStore.getStore("userSettingsStore");
  }
}

export const dataStores = new DataStores();
