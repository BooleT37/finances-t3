import type { Expense as ApiExpense } from "@prisma/client";
import assert from "assert";
import dayjs, { type Dayjs } from "dayjs";
import { groupBy, sum } from "lodash";
import { makeAutoObservable, observable, toJS } from "mobx";
import { computedFn } from "mobx-utils";
import { adaptExpenseFromApi } from "~/adapters/expense/expenseFromApi";
import {
  adaptExpenseToCreateInput,
  adaptExpenseToUpdateInput,
} from "~/adapters/expense/expenseToApi";
import categories from "~/readonlyStores/categories";
import type ComparisonData from "~/types/statistics/comparisonData";
import type DynamicsData from "~/types/statistics/dynamicsData";
import { type DynamicsDataMonth } from "~/types/statistics/dynamicsData";
import { trpc } from "~/utils/api";
import { DATE_FORMAT, MONTH_DATE_FORMAT } from "~/utils/constants";
import countUniqueMonths from "~/utils/countUniqueMonths";
import roundCost from "~/utils/roundCost";
import type Category from "../models/Category";
import { CATEGORY_IDS } from "../models/Category";
import type Expense from "../models/Expense";
import { type TableData } from "../models/Expense";
import type Subscription from "../models/Subscription";
import sources from "../readonlyStores/sources";
import costToString from "../utils/costToString";
import { type DataLoader } from "./DataLoader";
import savingSpendingStore from "./savingSpendingStore";
import subscriptionStore from "./subscriptionStore";

interface SubscriptionForPeriod {
  subscription: Subscription;
  firstDate: Dayjs;
}

const today = dayjs();

class ExpenseStore implements DataLoader<ApiExpense[]> {
  public expenses = observable.array<Expense>();

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.expense.getAll.query();
  }

  init(expenses: ApiExpense[]) {
    this.expenses.replace(expenses.map(adaptExpenseFromApi));
    this.fillPersonalExpenses(expenses);
  }

  get expensesByCategoryId(): Record<string, Expense[]> {
    return groupBy(this.expenses, "category.id");
  }

  expensesByCategoryIdForYear = computedFn(
    (year: number): Record<string, Expense[]> => {
      return groupBy(
        this.expenses.filter((e) => e.date.year() === year),
        "category.id"
      );
    }
  );

  getById(id: number): Expense | undefined {
    return this.expenses.find((e) => e.id === id);
  }

  tableData(
    startDate: Dayjs,
    endDate: Dayjs,
    searchString: string,
    includeUpcomingSubscriptions: boolean
  ): TableData[] {
    const rows = this.expenses
      .filter(
        (e) =>
          e.date.isSameOrAfter(startDate) &&
          e.date.isSameOrBefore(endDate) &&
          (!searchString ||
            e.name?.toLowerCase().includes(searchString.toLowerCase()))
      )
      .map((ex) => {
        const tableData = ex.asTableData;
        const pe = ex.personalExpense;
        if (tableData.cost && pe && pe.cost !== null) {
          const cost = costToString(pe.cost);
          const author =
            pe.category.id === CATEGORY_IDS.personal.Alexey ? "А" : "Л";
          tableData.cost.personalExpStr = `${cost} личных (${author})`;
        }
        return tableData;
      });
    if (includeUpcomingSubscriptions) {
      return rows.concat(
        this.availableSubscriptionsAsTableData(startDate, endDate, searchString)
      );
    }
    return rows;
  }

  nextId(): number {
    return Math.max(...this.expenses.map((e) => e.id)) + 1;
  }

  async add(expense: Expense): Promise<Expense> {
    expense.id = this.nextId();
    this.expenses.push(expense);
    const response = await trpc.expense.create.mutate(
      adaptExpenseToCreateInput(expense)
    );
    return adaptExpenseFromApi(response);
  }

  async modify(expense: Expense): Promise<Expense> {
    const foundIndex = this.expenses.findIndex((e) => e.id === expense.id);
    if (foundIndex !== -1) {
      this.expenses[foundIndex] = expense;
      const response = await trpc.expense.update.mutate({
        id: expense.id,
        data: adaptExpenseToUpdateInput(expense),
      });
      return adaptExpenseFromApi(response);
    } else {
      throw new Error(`Can't find expense with id ${expense.id}`);
    }
  }

  async delete(id: number): Promise<void> {
    const foundIndex = this.expenses.findIndex((e) => e.id === id);
    if (foundIndex === -1) {
      return;
    }
    const personalExpenseId = this.expenses[foundIndex]?.personalExpense?.id;
    this.expenses.splice(foundIndex, 1);
    await trpc.expense.delete.mutate({ id });
    if (personalExpenseId !== undefined) {
      await this.delete(personalExpenseId);
    }
  }

  fillPersonalExpenses(expenses: ApiExpense[]) {
    expenses.forEach((apiExpense) => {
      if (apiExpense.personalExpenseId !== null) {
        const expense = this.getById(apiExpense.id);
        if (expense) {
          expense.personalExpense =
            this.getById(apiExpense.personalExpenseId) ?? null;
        }
      }
    });
  }

  getSavingSpendingByCategoryId(id: number): Expense["savingSpending"] {
    for (const spending of savingSpendingStore.savingSpendings) {
      const found = spending.categories.find((c) => c.id === id);
      if (found) {
        return {
          spending,
          category: found,
        };
      }
    }
    throw new Error(`Can't find spending by category id ${id}`);
  }

  get totalMonths(): number {
    return countUniqueMonths(this.expenses.map((e) => e.date));
  }

  getComparisonData(
    from: Dayjs,
    to: Dayjs,
    granularity: "month" | "quarter" | "year"
  ): ComparisonData {
    const expensesFrom = this.expenses.filter(
      (e) =>
        !e.category.isIncome &&
        !e.category.toSavings &&
        e.date.isSame(from, granularity)
    );
    const expensesTo = this.expenses.filter(
      (e) =>
        !e.category.isIncome &&
        !e.category.toSavings &&
        e.date.isSame(to, granularity)
    );
    const map: Record<string, { from: number; to: number }> = {};
    expensesFrom.forEach((e) => {
      const categoryId = String(e.category.id);
      if (e.cost !== null) {
        const categoryCosts = map[categoryId];
        if (categoryCosts === undefined) {
          map[categoryId] = { from: e.cost, to: 0 };
        } else {
          categoryCosts.from += e.cost;
        }
      }
    });
    expensesTo.forEach((e) => {
      const categoryId = String(e.category.id);
      if (e.cost !== null) {
        const categoryCosts = map[categoryId];
        if (categoryCosts === undefined) {
          map[categoryId] = { from: 0, to: e.cost };
        } else {
          categoryCosts.to += e.cost;
        }
      }
    });
    return toJS(
      Object.entries(map).map(([category, costs]) => ({
        category: categories.getById(parseInt(category)).shortname,
        period1: costs.from,
        period2: costs.to,
      }))
    );
  }

  getDynamicsData(
    from: Dayjs,
    to: Dayjs,
    categoriesIds: number[]
  ): DynamicsData {
    type MonthEntry = Record<string, number> & { date: Dayjs };
    const dict: Record<string, MonthEntry> = {};

    let filteredExpensed = this.expenses.filter((e) =>
      e.date.isBetween(from, to, "month", "[]")
    );

    if (categoriesIds.length > 0) {
      filteredExpensed = filteredExpensed.filter((e) =>
        categoriesIds.includes(e.category.id)
      );
    }
    filteredExpensed.forEach((e) => {
      if (e.cost === null) {
        return;
      }
      const month = e.date.format(MONTH_DATE_FORMAT);
      const monthEntry = dict[month];
      if (monthEntry !== undefined) {
        if (monthEntry[e.category.id] !== undefined) {
          monthEntry[e.category.id] += e.cost;
        } else {
          monthEntry[e.category.id] = e.cost;
        }
      } else {
        dict[month] = {
          date: e.date,
          [e.category.id.toString()]: e.cost,
        } as MonthEntry;
      }
    });

    const interim = from.clone();
    const allCategoriesIds =
      categoriesIds.length === 0
        ? categories.getAll().map((c) => c.id)
        : categoriesIds;
    while (to > interim || interim.format("M") === to.format("M")) {
      const month = interim.format(MONTH_DATE_FORMAT);
      if (dict[month] === undefined) {
        dict[month] = {
          date: interim.clone(),
        } as MonthEntry;
      }
      const monthEntry = dict[month];
      assert(monthEntry); // to make typescript happy
      for (const categoryId of allCategoriesIds) {
        if (monthEntry[categoryId] === undefined) {
          monthEntry[categoryId] = 0;
        }
      }
      interim.add(1, "month");
    }

    const data: DynamicsDataMonth[] = Object.values(dict)
      .sort((a, b) => (a.date.isBefore(b.date, "month") ? -1 : 1))
      .map((e) => {
        const month = e.date.format(MONTH_DATE_FORMAT);
        const { date, ...eWithoutDate } = { ...e };
        return { month, ...eWithoutDate } as DynamicsDataMonth;
      });

    data.forEach((m) => {
      Object.keys(m).forEach((k) => {
        const value = m[k];
        if (typeof value === "number") {
          m[k] = roundCost(value);
        }
      });
    });

    return data;
  }

  get lastExpensesPerSource(): Record<number, Expense[]> {
    return Object.fromEntries(
      sources.getAll().map<[number, Expense[]]>((s) => {
        const expensesWithSource = this.expenses.filter(
          (e) => e.source?.id === s.id
        );
        if (expensesWithSource.length > 0) {
          const lastDate = dayjs.max(expensesWithSource.map((e) => e.date));
          return [
            s.id,
            expensesWithSource.filter((expense) =>
              expense.date.isSame(lastDate, "date")
            ),
          ];
        }
        return [s.id, []];
      })
    );
  }

  totalForMonth(year: number, month: number, isIncome: boolean) {
    return sum(
      this.expenses
        .filter(
          (expense) =>
            expense.date.month() === month &&
            expense.date.year() === year &&
            expense.category.isIncome === isIncome &&
            !expense.category.fromSavings
        )
        .map((expense) => expense.cost ?? 0)
    );
  }

  getAvailableSubscriptions(
    startDate: Dayjs,
    endDate: Dayjs,
    category?: Category
  ): SubscriptionForPeriod[] {
    const allSubscriptions = category
      ? subscriptionStore.activeByCategory[category.name] ?? []
      : subscriptionStore.activeSubscriptions;
    let subscriptionsForPeriod = allSubscriptions
      .map((subscription): SubscriptionForPeriod | null => {
        const firstDate = subscription.firstDateInInterval(startDate, endDate);
        if (firstDate) {
          return {
            subscription,
            firstDate,
          };
        }
        return null;
      })
      .filter(
        (subscription): subscription is SubscriptionForPeriod => !!subscription
      );

    if (subscriptionsForPeriod.length === 0) {
      return [];
    }
    const allExpenses = category
      ? this.expensesByCategoryId[category.id]
      : this.expenses;
    assert(allExpenses);
    const addedSubscriptionsIds = allExpenses
      .filter(
        (expense): expense is Expense & { subscription: Subscription } =>
          expense.subscription !== null &&
          expense.date.isBetween(startDate, endDate, "day", "[]")
      )
      .map((e) => e.subscription.id);
    subscriptionsForPeriod = subscriptionsForPeriod.filter(
      (subscription) =>
        !addedSubscriptionsIds.includes(subscription.subscription.id)
    );
    return subscriptionsForPeriod;
  }

  availableSubscriptionsAsTableData(
    startDate: Dayjs,
    endDate: Dayjs,
    searchString: string
  ): TableData[] {
    const subscriptions = this.getAvailableSubscriptions(startDate, endDate);

    let rows = subscriptions.map(({ subscription, firstDate }) => ({
      category: subscription.category.name,
      categoryId: subscription.category.id,
      categoryShortname: subscription.category.shortname,
      subcategory: "",
      cost: {
        value: subscription.cost,
        isSubscription: true,
        isUpcomingSubscription: true,
      },
      date: firstDate.format(DATE_FORMAT),
      id: 0,
      isUpcomingSubscription: true,
      name: subscription.name,
    }));
    if (searchString) {
      rows = rows.filter((data) => data.name.includes(searchString));
    }
    return rows;
  }

  savingSpendingsForecast(year: number, month: number): number {
    return sum(
      this.expenses
        .filter(
          (
            expense
          ): expense is Expense & {
            savingSpending: NonNullable<Expense["savingSpending"]>;
          } =>
            expense.savingSpending !== null &&
            expense.date.month() === month &&
            expense.date.year() === year
        )
        .map((expense) => expense.savingSpending.category.forecast)
    );
  }

  get boundaryDates(): [Dayjs, Dayjs] {
    const sorted = this.expenses
      .slice()
      .sort((e1, e2) => e1.date.valueOf() - e2.date.valueOf());
    const firstExpense = sorted[0],
      lastExpense = sorted[sorted.length - 1];

    if (!firstExpense || !lastExpense) {
      return [today, today];
    }
    return [firstExpense.date, lastExpense.date];
  }
}

const expenseStore = new ExpenseStore();

export default expenseStore;
