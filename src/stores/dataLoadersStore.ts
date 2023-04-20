import { Modal } from "antd";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { StoreState } from "~/models/StoreState";
import type { CategoriesStore } from "~/stores/categoriesStore";
import type { ExpenseStore } from "~/stores/expenseStore";
import type { ForecastStore } from "~/stores/forecastStore";
import type { SavingSpendingStore } from "~/stores/savingSpendingStore";
import type { SourcesStore } from "~/stores/sourcesStore";
import type { SubscriptionStore } from "~/stores/subscriptionStore";
import type { UserSettingsStore } from "~/stores/userSettingsStore";
import { type DataLoader } from "./DataLoader";

export interface Stores {
  categoriesStore: CategoriesStore | false;
  sourcesStore: SourcesStore | false;
  forecastStore: ForecastStore | false;
  subscriptionStore: SubscriptionStore | false;
  savingSpendingStore: SavingSpendingStore | false;
  expenseStore: ExpenseStore | false;
  userSettingsStore: UserSettingsStore | false;
}

type StoresStates = {
  [key in keyof Stores]: StoreState<Exclude<Stores[key], false>>;
};

type NotSkippedStores = {
  [key in keyof Stores]: Exclude<Stores[key], false>;
};

class DataLoadersStore {
  stores = observable.object<StoresStates>({
    categoriesStore: new StoreState<CategoriesStore>(),
    sourcesStore: new StoreState<SourcesStore>(),
    forecastStore: new StoreState<ForecastStore>(),
    subscriptionStore: new StoreState<SubscriptionStore>(),
    savingSpendingStore: new StoreState<SavingSpendingStore>(),
    expenseStore: new StoreState<ExpenseStore>(),
    userSettingsStore: new StoreState<UserSettingsStore>(),
  });

  constructor() {
    makeAutoObservable(this);
  }

  initStores = async (stores: Stores) => {
    const storeNames = (Object.keys(stores) as (keyof Stores)[]).filter(
      (name) => stores[name] !== false
    );
    const notSkippedStores = Object.fromEntries(
      Object.entries(stores).filter(([_name, store]) => !!store)
    ) as NotSkippedStores;

    try {
      const datum = await Promise.all(
        storeNames.map(async <Key extends keyof Stores>(name: Key) => {
          const storeState = this.stores[name];
          if (storeState.loaded || storeState.loading) {
            return;
          }
          const store = notSkippedStores[name];
          storeState.init(store);
          storeState.setLoading(true);
          const data = await store.loadData();
          storeState.setLoading(false);
          storeState.setLoaded();
          return data;
        })
      );
      runInAction(() => {
        storeNames.map(<Key extends keyof Stores>(name: Key, index: number) => {
          if (datum[index]) {
            (notSkippedStores[name] as DataLoader).init(datum[index]);
          }
        });
      });
    } catch (e) {
      Modal.error({
        title: "Ошибка при загрузке данных",
        content:
          "При загрузке данных произошла ошибка. Вероятнее всего, превышено время ожидания ответа. Перезагрузите страницу",
      });
      throw e;
    }
  };

  initStore<Key extends keyof Stores>(
    key: Key,
    store: Exclude<Stores[Key], false>
  ) {
    this.stores[key].init(store);
  }

  get dataLoaded() {
    return Object.values(this.stores)
      .filter(({ store }) => store !== undefined)
      .every(({ loading }) => !loading);
  }
}

export const dataLoadersStore = new DataLoadersStore();
