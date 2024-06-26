import { type ExpenseComponent as ExpenseComponentApi } from "@prisma/client";
import { action, makeAutoObservable, observable, toJS, trace } from "mobx";
import Expense from "~/models/Expense";
import { ExpenseComponent } from "~/models/ExpenseComponent";
import { dataStores } from "~/stores/dataStores";
import { type ValidatedFormValues } from "./models";

class ExpenseModalViewModel {
  visible = false;
  expenseId: number | null = null;
  lastExpenseId: number | null = null;
  lastSource: number | undefined = undefined;
  originalComponents = observable.array<ExpenseComponent>();
  currentComponents = observable.array<ExpenseComponent>();
  componentsModalOpen = false;
  componentsModalIdHighlighted: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentExpense(): Expense | undefined {
    const res = dataStores.expenseStore.expenses.find(
      ({ id }) => this.expenseId === id
    );
    return res;
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
    this.originalComponents.replace(this.currentExpense?.components ?? []);
    this.currentComponents.replace(this.currentExpense?.components ?? []);
  }

  reset(): void {
    this.expenseId = null;
    this.originalComponents.replace([]);
    this.currentComponents.replace([]);
  }

  close(source: number | undefined): void {
    this.reset();
    this.lastSource = source;
    this.visible = false;
    this.lastExpenseId = null;
  }

  setLastExpenseId(expenseId: number): void {
    this.lastExpenseId = expenseId;
  }

  async insertExpense(values: ValidatedFormValues): Promise<Expense> {
    const category = dataStores.categoriesStore.getById(values.category);
    const newExpense = new Expense(
      -1,
      parseFloat(values.cost),
      toJS(this.currentComponents.map((c) => c.asJSON)),
      values.date,
      category,
      values.subcategory === undefined
        ? null
        : category.findSubcategoryById(values.subcategory),
      values.name,
      values.source !== undefined
        ? dataStores.sourcesStore.getById(values.source)
        : null,
      values.subscription === undefined
        ? null
        : dataStores.subscriptionStore.getById(values.subscription),
      values.savingSpendingCategoryId === undefined
        ? null
        : dataStores.expenseStore.getSavingSpendingByCategoryId(
            values.savingSpendingCategoryId
          )
    );
    // if we are editing the expense
    if (expenseModalViewModel.expenseId !== null) {
      newExpense.id = expenseModalViewModel.expenseId;
      const modifyingExpense = dataStores.expenseStore.getById(
        expenseModalViewModel.expenseId
      );
      if (!modifyingExpense) {
        throw new Error(
          `Can't change the expense with id '${expenseModalViewModel.expenseId}'`
        );
      }
      return await dataStores.expenseStore.modify(
        newExpense,
        this.originalComponents
      );
    } else {
      return await dataStores.expenseStore.add(newExpense);
    }
  }

  get currentComponentsLength(): number {
    trace();
    return this.currentComponents.length;
  }

  setCurrentComponents(components: ExpenseComponentApi[]): void {
    const expense = this.currentExpense;
    if (!expense) {
      console.error(
        "Can't set components without current expense. No current expense"
      );
      return;
    }
    this.currentComponents.replace(
      components.map(
        (c) =>
          new ExpenseComponent(
            c.id,
            c.name,
            c.cost,
            dataStores.categoriesStore.getById(c.categoryId),
            c.subcategoryId === null
              ? null
              : dataStores.categoriesStore.getSubcategoryById(
                  c.categoryId,
                  c.subcategoryId
                ),
            c.expenseId,
            expense
          )
      )
    );
  }

  setComponentsModalOpen(open: boolean) {
    this.componentsModalOpen = open;
  }

  highlightComponentInModal(id: number) {
    this.componentsModalIdHighlighted = id;

    setTimeout(
      action(() => {
        this.componentsModalIdHighlighted = null;
      }),
      3500
    );
  }
}

const expenseModalViewModel = new ExpenseModalViewModel();

export default expenseModalViewModel;
