import { type inferRouterOutputs } from "@trpc/server";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import { makeAutoObservable } from "mobx";
import { type AppRouter } from "~/server/api/root";
import { trpc } from "~/utils/api";
import { type DataLoader } from "./dataStores";

export default class UserSettingsStore
  implements DataLoader<inferRouterOutputs<AppRouter>["userSettings"]["get"]>
{
  pePerMonth = 50;
  savings?: {
    sum: number;
    date: dayjs.Dayjs;
  } = undefined;
  expenseCategoriesOrder: number[] = [];
  incomeCategoriesOrder: number[] = [];
  sourcesOrder: number[] = [];
  inited = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.userSettings.get.query();
  }

  init(settings: inferRouterOutputs<AppRouter>["userSettings"]["get"]) {
    if (!settings) {
      throw "Can't get settings for user";
    }
    this.pePerMonth = settings.pePerMonth;
    if (settings.savings !== null && settings.savingsDate !== null) {
      this.savings = {
        sum: settings.savings,
        date: dayjs(settings.savingsDate),
      };
    }
    this.incomeCategoriesOrder = settings.incomeCategoriesOrder;
    this.expenseCategoriesOrder = settings.expenseCategoriesOrder;
    this.sourcesOrder = settings.sourcesOrder;
    this.inited = true;
  }

  setPePerMonth = async (sum: number) => {
    await trpc.userSettings.update.mutate({ pePerMonth: sum });
    this.pePerMonth = sum;
  };

  setSavings = async (sum: number) => {
    const today = dayjs();
    await trpc.userSettings.update.mutate({
      savings: sum,
      savingsDate: today.toDate(),
    });
    this.savings = {
      sum,
      date: today,
    };
  };

  removeSavings = async () => {
    await trpc.userSettings.update.mutate({
      savings: null,
      savingsDate: null,
    });
    this.savings = undefined;
  };

  persistIncomeCategoryOrder = async (order: number[]) => {
    if (isEqual(order, this.incomeCategoriesOrder)) {
      return;
    }
    this.incomeCategoriesOrder = order;
    await trpc.userSettings.update.mutate({
      incomeCategoriesOrder: order,
    });
  };

  persistExpenseCategoryOrder = async (order: number[]) => {
    if (isEqual(order, this.expenseCategoriesOrder)) {
      return;
    }
    this.expenseCategoriesOrder = order;
    await trpc.userSettings.update.mutate({
      expenseCategoriesOrder: order,
    });
  };

  persistSourcesOrder = async (order: number[]) => {
    if (isEqual(order, this.sourcesOrder)) {
      return;
    }
    this.sourcesOrder = order;
    await trpc.userSettings.update.mutate({
      sourcesOrder: order,
    });
  };
}
