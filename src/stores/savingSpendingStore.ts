import { type inferRouterOutputs } from "@trpc/server";
import dayjs, { type Dayjs } from "dayjs";
import sum from "lodash/sum";
import { makeAutoObservable, observable, runInAction } from "mobx";
import { adaptSavingSpendingFromApi } from "~/adapters/savingSpending/savingSpendingFromApi";
import {
  adaptSavingSpendingToCreateInput,
  adaptSavingSpendingToUpdateInput,
} from "~/adapters/savingSpending/savingSpendingToApi";
import type SavingSpendingEditing from "~/models/SavingSpendingEditing";
import { type AppRouter } from "~/server/api/root";
import type { Option } from "~/types/types";
import { trpc } from "~/utils/api";
import { SAVINGS_DATE_LS_KEY, SAVINGS_LS_KEY } from "~/utils/constants";
import { CATEGORY_IDS } from "../models/Category";
import type SavingSpending from "../models/SavingSpending";
import { type DataLoader } from "./DataLoader";
import expenseStore from "./expenseStore";

class SavingSpendingStore
  implements
    DataLoader<inferRouterOutputs<AppRouter>["savingSpending"]["getAll"]>
{
  public dataLoaded = false;
  savingSpendings = observable.array<SavingSpending>();
  initialSavings: number;
  initialSavingsDate: Dayjs | null;

  constructor() {
    makeAutoObservable(this);

    this.initialSavings = parseFloat(
      typeof window !== "undefined"
        ? localStorage.getItem(SAVINGS_LS_KEY) ?? "0"
        : "0"
    );
    this.initialSavingsDate =
      typeof window !== "undefined" && localStorage[SAVINGS_DATE_LS_KEY]
        ? dayjs(localStorage.getItem(SAVINGS_DATE_LS_KEY))
        : null;
  }

  setDataLoaded(dataLoaded: boolean): void {
    this.dataLoaded = dataLoaded;
  }

  async loadData() {
    return trpc.savingSpending.getAll.query();
  }

  init(
    savingSpendings: inferRouterOutputs<AppRouter>["savingSpending"]["getAll"]
  ) {
    this.savingSpendings.replace(
      savingSpendings.map(adaptSavingSpendingFromApi)
    );
  }

  getById(id: number): SavingSpending {
    const spending = this.savingSpendings.find((s) => s.id === id);
    if (!spending) {
      throw new Error(`Cannot find spending with id ${id}`);
    }
    return spending;
  }

  async addSpending(spending: SavingSpendingEditing) {
    const savedSpending = await trpc.savingSpending.create.mutate(
      adaptSavingSpendingToCreateInput(spending)
    );
    runInAction(() => {
      this.savingSpendings.push(adaptSavingSpendingFromApi(savedSpending));
    });
  }

  async editSpending(spending: SavingSpendingEditing) {
    const currentSpendingIndex = this.savingSpendings.findIndex(
      ({ id }) => spending.id === id
    );
    const updatedSpending = await trpc.savingSpending.update.mutate({
      data: adaptSavingSpendingToUpdateInput(spending),
      id: spending.id,
    });
    runInAction(() => {
      this.savingSpendings.splice(
        currentSpendingIndex,
        1,
        adaptSavingSpendingFromApi(updatedSpending)
      );
    });
  }

  async removeSpending(id: number) {
    const spending = this.getById(id);

    // all categories are removed automatically via "cascade"
    await trpc.savingSpending.delete.mutate({ id });

    runInAction(() => {
      this.savingSpendings.remove(spending);
    });
  }

  get asOptions(): Option[] {
    return this.savingSpendings.map((s) => s.asOption);
  }

  categoriesAsOptions(id: number): Option[] {
    return this.getById(id).categories.map((c) => c.asOption);
  }

  get currentSpendings(): number | null {
    if (!this.initialSavingsDate) {
      return null;
    }

    const toSavingsExpenses =
      CATEGORY_IDS.toSavings in expenseStore.expensesByCategoryId
        ? expenseStore.expensesByCategoryId[CATEGORY_IDS.toSavings] ?? []
        : [];

    const fromSavingsExpenses =
      CATEGORY_IDS.fromSavings in expenseStore.expensesByCategoryId
        ? expenseStore.expensesByCategoryId[CATEGORY_IDS.fromSavings] ?? []
        : [];

    return (
      sum(
        toSavingsExpenses
          .concat(fromSavingsExpenses)
          .filter((expense) =>
            expense.date.isSameOrAfter(this.initialSavingsDate, "date")
          )
          .map((expense) =>
            expense.category.id === CATEGORY_IDS.fromSavings
              ? -(expense.cost ?? 0)
              : expense.cost
          )
      ) + this.initialSavings
    );
  }

  setInitialSavings(savings: number) {
    this.initialSavings = savings;
  }

  setInitialSavingsDate(date: Dayjs) {
    this.initialSavingsDate = date;
  }
}

const savingSpendingStore = new SavingSpendingStore();

export default savingSpendingStore;
