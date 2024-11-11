import { makeAutoObservable } from "mobx";
import type { ParsedExpense } from "~/models/ParsedExpense";
import type Source from "~/models/Source";
import { dataStores } from "~/stores/dataStores";

class ImportModalViewModel {
  visible = false;
  loading = false;
  selectedSourceId: number | null = null;
  parsedExpenses: ParsedExpense[] | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
    this.loading = false;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setSelectedSourceId(sourceId: number) {
    this.selectedSourceId = sourceId;
  }

  get selectedSource(): Source | null {
    if (this.selectedSourceId === null) {
      return null;
    }
    return dataStores.sourcesStore.getById(this.selectedSourceId);
  }

  setParsedExpenses(expenses: ParsedExpense[]) {
    this.parsedExpenses = expenses;
  }

  removeParsedExpenses() {
    this.parsedExpenses = null;
  }
}

const importModalViewModel = new ImportModalViewModel();

export default importModalViewModel;
