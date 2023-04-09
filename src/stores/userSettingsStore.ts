import { type inferRouterOutputs } from "@trpc/server";
import dayjs from "dayjs";
import { makeAutoObservable } from "mobx";
import { type AppRouter } from "~/server/api/root";
import { trpc } from "~/utils/api";
import { type DataLoader } from "./DataLoader";

export class UserSettingsStore
  implements DataLoader<inferRouterOutputs<AppRouter>["userSettings"]["get"]>
{
  public dataLoaded = false;
  public dataLoading = false;
  pePerMonth = 50;
  savings?: {
    sum: number;
    date: dayjs.Dayjs;
  } = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setDataLoaded(dataLoaded: boolean): void {
    this.dataLoaded = dataLoaded;
  }

  setDataLoading(dataLoading: boolean): void {
    this.dataLoading = dataLoading;
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
}

const userSettingsStore = new UserSettingsStore();

export default userSettingsStore;
