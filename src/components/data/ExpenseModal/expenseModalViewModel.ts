import { type ExpenseComponent as ExpenseComponentApi } from "@prisma/client";
import Decimal from "decimal.js";
import { action, makeAutoObservable, observable, toJS } from "mobx";
import Expense, { type ExpenseComponentData } from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import { type ValidatedFormValues } from "./models";

class ExpenseModalViewModel {
  visible = false;
  expenseId: number | null = null;
  lastExpenseId: number | null = null;
  lastSource: number | undefined = undefined;
  originalComponents = observable.array<ExpenseComponentApi>();
  private currentComponents = observable.array<ExpenseComponentData>();
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

  get currentComponentsImmutable(): ExpenseComponentData[] {
    return toJS(this.currentComponents);
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
      new Decimal(values.cost),
      [],
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
    if (this.currentComponents.length > 0) {
      newExpense.replaceComponents(
        this.currentComponents.map(
          (c): ExpenseComponentData => ({
            id: c.id,
            name: c.name,
            cost: new Decimal(c.cost),
            categoryId: c.categoryId,
            subcategoryId: c.subcategoryId,
          })
        )
      );
    }
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
    return this.currentComponents.length;
  }

  setCurrentComponents(components: ExpenseComponentData[]): void {
    this.currentComponents.replace(components);
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
