import { makeAutoObservable } from "mobx";
import type Expense from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";

class ExpenseModalViewModel {
  visible = false;
  expenseId: number | null = null;
  lastExpenseId: number | null = null;
  lastSource: number | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get currentExpense(): Expense | undefined {
    return dataStores.expenseStore.expenses.find(
      ({ id }) => this.expenseId === id
    );
  }

  get lastExpense(): Expense | undefined {
    return dataStores.expenseStore.expenses.find(
      ({ id }) => this.lastExpenseId === id
    );
  }

  get isNewExpense(): boolean {
    return this.currentExpense === undefined;
  }

  open(expenseId: number | null): void {
    this.expenseId = expenseId;
    this.visible = true;
  }

  close(source: number | undefined): void {
    this.lastSource = source;
    this.expenseId = null;
    this.visible = false;
    this.lastExpenseId = null;
  }
}

const expenseModalViewModel = new ExpenseModalViewModel();

export default expenseModalViewModel;
