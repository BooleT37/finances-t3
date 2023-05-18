import { makeAutoObservable } from "mobx";
import { type DataLoader } from "~/stores/dataStores";

export class StoreState<T extends DataLoader> {
  store?: T = undefined;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  init(store: T) {
    this.store = store;
    this.loading = true;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }
}
