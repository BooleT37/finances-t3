import { type inferRouterOutputs } from "@trpc/server";
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
import type SavingSpending from "../models/SavingSpending";
import { type DataLoader } from "./dataStores";
import { dataStores } from "./dataStores/DataStores";

export default class SavingSpendingStore
  implements
    DataLoader<inferRouterOutputs<AppRouter>["savingSpending"]["getAll"]>
{
  savingSpendings = observable.array<SavingSpending>();
  inited = false;

  constructor() {
    makeAutoObservable(this);
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
    this.inited = true;
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
    const { savings } = dataStores.userSettingsStore;
    if (!savings) {
      return null;
    }

    const { fromSavingsCategory, toSavingsCategory } =
      dataStores.categoriesStore;

    const toSavingsExpenses =
      toSavingsCategory.id in dataStores.expenseStore.expensesByCategoryId
        ? dataStores.expenseStore.expensesByCategoryId[toSavingsCategory.id] ??
          []
        : [];

    const fromSavingsExpenses =
      fromSavingsCategory.id in dataStores.expenseStore.expensesByCategoryId
        ? dataStores.expenseStore.expensesByCategoryId[
            fromSavingsCategory.id
          ] ?? []
        : [];

    return (
      sum(
        toSavingsExpenses
          .concat(fromSavingsExpenses)
          .filter((expense) => expense.date.isSameOrAfter(savings.date, "date"))
          .map((expense) =>
            expense.category.type === "FROM_SAVINGS"
              ? -(expense.cost ?? 0)
              : expense.cost
          )
      ) + savings.sum
    );
  }
}
