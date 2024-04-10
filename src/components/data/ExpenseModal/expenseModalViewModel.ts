import { type ExpenseComponent } from "@prisma/client";
import {
  action,
  makeAutoObservable,
  observable,
  runInAction,
  toJS,
  trace,
} from "mobx";
import Expense from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import { type ValidatedFormValues } from "./models";
import generatePersonalExpenseName from "./utils/generatePersonalExpenseName";

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
    this.originalComponents.replace(
      this.currentExpense?.components.map((c) => c.asJSON) ?? []
    );
    this.currentComponents.replace(
      this.currentExpense?.components.map((c) => c.asJSON) ?? []
    );
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
      toJS(this.currentComponents),
      values.date,
      category,
      values.subcategory === undefined
        ? null
        : category.findSubcategoryById(values.subcategory),
      values.name,
      null,
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
      // if there are personal expenses
      if (values.personalExpCategoryId !== undefined) {
        // if there were personal expenses in the modifying expense
        if (modifyingExpense.personalExpense) {
          const modifyingPe = modifyingExpense.personalExpense;
          // if the personal expenses didn't change
          if (
            modifyingPe.category.id === values.personalExpCategoryId &&
            modifyingPe.cost?.toString() === values.personalExpSpent
          ) {
            newExpense.personalExpenseId = modifyingPe.id;
            newExpense.cost = (newExpense.cost ?? 0) - (modifyingPe.cost ?? 0);
          } else {
            const category = dataStores.categoriesStore.getById(
              values.personalExpCategoryId
            );
            const personalExpense = new Expense(
              modifyingPe.id,
              parseFloat(values.personalExpSpent),
              [],
              modifyingPe.date,
              category,
              values.subcategory === undefined
                ? null
                : category.findSubcategoryById(values.subcategory),
              generatePersonalExpenseName({
                category: dataStores.categoriesStore.getById(values.category)
                  .name,
                name: values.name,
              }),
              null,
              null
            );
            newExpense.personalExpenseId = personalExpense.id;
            newExpense.cost =
              (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
            await dataStores.expenseStore.modify(
              personalExpense,
              this.originalComponents
            );
          }
        } else {
          const category = dataStores.categoriesStore.getById(
            values.personalExpCategoryId
          );
          const personalExpense = new Expense(
            -1,
            parseFloat(values.personalExpSpent),
            [],
            values.date,
            category,
            values.subcategory === undefined
              ? null
              : category.findSubcategoryById(values.subcategory),
            generatePersonalExpenseName({
              category: dataStores.categoriesStore.getById(values.category)
                .name,
              name: values.name,
            }),
            null,
            null
          );
          await dataStores.expenseStore.add(personalExpense);
          newExpense.personalExpenseId = personalExpense.id;
          newExpense.cost =
            (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
        }
        return await dataStores.expenseStore.modify(
          newExpense,
          this.originalComponents
        );
      } else {
        if (modifyingExpense.personalExpense) {
          const { id: peId } = modifyingExpense.personalExpense;
          newExpense.personalExpenseId = null;
          await dataStores.expenseStore.delete(peId);
          return await dataStores.expenseStore.modify(
            newExpense,
            this.originalComponents
          );
        }
        return await dataStores.expenseStore.modify(
          newExpense,
          this.originalComponents
        );
      }
    } else {
      if (values.personalExpCategoryId !== undefined) {
        const category = dataStores.categoriesStore.getById(
          values.personalExpCategoryId
        );
        const personalExpense = new Expense(
          -1,
          parseFloat(values.personalExpSpent),
          [],
          values.date,
          category,
          null,
          generatePersonalExpenseName({
            category: dataStores.categoriesStore.getById(values.category).name,
            name: values.name,
          }),
          null,
          null
        );
        newExpense.cost = (newExpense.cost ?? 0) - (personalExpense.cost ?? 0);
        const addedPersonalExpense = await dataStores.expenseStore.add(
          personalExpense
        );
        runInAction(() => {
          newExpense.personalExpenseId = addedPersonalExpense.id;
        });
      }
      console.log(newExpense);
      return await dataStores.expenseStore.add(newExpense);
    }
  }

  get currentComponentsLength(): number {
    trace();
    return this.currentComponents.length;
  }

  setCurrentComponents(components: ExpenseComponent[]): void {
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
