import { message } from "antd";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { makeAutoObservable } from "mobx";
import {
  ParsedExpense,
  type ParsedExpenseFromApi,
} from "~/models/ParsedExpense";
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

  setParsedExpenses(expenses: ParsedExpenseFromApi[]) {
    this.parsedExpenses = expenses.map(
      (expense) =>
        new ParsedExpense(
          dayjs(expense.date),
          expense.type,
          expense.description,
          new Decimal(expense.amount),
          expense.hash
        )
    );
    if (this.parsedExpenses.some((e) => !!e.existingExpense)) {
      message.warning(
        "Расходы, не отмеченные галочкой, уже существуют в базе данных"
      );
    }
  }

  removeParsedExpenses() {
    this.parsedExpenses = null;
  }
}

const importModalViewModel = new ImportModalViewModel();

export default importModalViewModel;
