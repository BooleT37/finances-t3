import { Modal } from "antd";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { StoreState } from "~/models/StoreState";
import type CategoriesStore from "~/stores/CategoriesStore";
import type ExpenseStore from "~/stores/ExpenseStore";
import type ForecastStore from "~/stores/ForecastStore";
import type SavingSpendingStore from "~/stores/SavingSpendingStore";
import type SourcesStore from "~/stores/SourcesStore";
import type SubscriptionStore from "~/stores/SubscriptionStore";
import type UserSettingsStore from "~/stores/UserSettingsStore";
import type { DataLoader, Stores, StoresClasses } from "./types";

function uncapitalise<T extends string>(string: T): Uncapitalize<T> {
  const firstChar = string[0];
  if (firstChar === undefined) {
    throw new Error("Can't uncapitalise empty string");
  }

  return (firstChar.toLowerCase() + string.slice(1)) as Uncapitalize<T>;
}

export type StoresToInit = {
  [key in keyof StoresClasses]: StoresClasses[key] | false;
};

export type StoresState = {
  [key in keyof Stores]: StoreState<Stores[key]>;
};

class DataStoresStateStore {
  state = observable.object<StoresState>({
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

  initStores = async (storeClasses: StoresToInit) => {
    const storesToInitNames = (
      Object.keys(storeClasses) as (keyof StoresToInit)[]
    ).filter((name) => storeClasses[name] !== false);
    const storesToInit = Object.fromEntries(
      Object.entries(storeClasses).filter(([_name, store]) => store !== false)
    ) as unknown as StoresClasses;

    try {
      const datum = await Promise.all(
        storesToInitNames.map(
          async <Key extends keyof StoresToInit>(className: Key) => {
            const storeName = uncapitalise(className);
            const storeState = this.state[storeName];
            if (storeState.store?.inited || storeState.loading) {
              return;
            }
            const storeClass = storesToInit[className];
            const store = new storeClass() as Stores[typeof storeName];
            storeState.init(store);
            storeState.setLoading(true);
            const data = await store.loadData();
            return data;
          }
        )
      );
      runInAction(() => {
        storesToInitNames.map(
          <Key extends keyof StoresToInit>(className: Key, index: number) => {
            const storeName = uncapitalise(className);
            if (datum[index]) {
              const storeState = this.state[storeName];
              (storeState.store as DataLoader).init(datum[index]);
              storeState.setLoading(false);
            }
          }
        );
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

  storesLoaded = (stores: StoresToInit) =>
    (Object.keys(stores) as (keyof StoresToInit)[])
      .filter((key) => stores[key] !== false)
      .map((storeName) => this.state[uncapitalise(storeName)])
      .every(({ store, loading }) => store !== undefined && !loading);

  getStore<Key extends keyof Stores>(name: Key): Stores[Key] {
    const store = this.state[name].store;
    if (!store) {
      throw new Error(
        `Store ${name} is not initialised. Have you forgotten to add it to the dependencies?`
      );
    }
    return store;
  }
}

export const dataStoresStateStore = new DataStoresStateStore();
