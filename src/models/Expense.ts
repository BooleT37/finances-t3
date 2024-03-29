import { type Dayjs } from "dayjs";
import { makeAutoObservable } from "mobx";
import { dataStores } from "~/stores/dataStores";
import { DATE_FORMAT } from "~/utils/constants";
import type Category from "./Category";
import type SavingSpending from "./SavingSpending";
import type SavingSpendingCategory from "./SavingSpendingCategory";
import type Source from "./Source";
import type Subcategory from "./Subcategory";
import type Subscription from "./Subscription";

export interface CostCol {
  value: number;
  personalExpStr?: string;
  isSubscription?: boolean;
  isUpcomingSubscription?: boolean;
}

export interface TableData {
  id: number;
  name: string;
  cost: CostCol | null;
  date: string;
  category: string;
  categoryId: number;
  categoryShortname: string;
  subcategory: string | null;
  source: string;
  isUpcomingSubscription: boolean;
}

export default class Expense {
  id: number;
  name: string;
  cost: number;
  date: Dayjs;
  category: Category;
  subcategory: Subcategory | null;
  personalExpenseId: number | null;
  source: Source | null;
  subscription: Subscription | null;
  savingSpending: {
    spending: SavingSpending;
    category: SavingSpendingCategory;
  } | null;

  constructor(
    id: number,
    cost: number,
    date: Dayjs,
    category: Category,
    subcategory: Subcategory | null,
    name: string,
    personalExpenseId: number | null = null,
    source: Source | null = null,
    subscription: Subscription | null = null,
    savingSpending: {
      spending: SavingSpending;
      category: SavingSpendingCategory;
    } | null = null
  ) {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.id = id;
    this.cost = cost;
    this.date = date;
    this.category = category;
    this.subcategory = subcategory;
    this.personalExpenseId = personalExpenseId;
    this.name = name;
    this.source = source;
    this.subscription = subscription;
    this.savingSpending = savingSpending;
  }

  get tableDataName(): string {
    const name = this.name || "";
    if (this.savingSpending !== null) {
      const savingSpendingInfo = this.savingSpending.category.name
        ? `${this.savingSpending.spending.name} - ${this.savingSpending.category.name}`
        : this.savingSpending.spending.name;
      if (name) {
        return `${savingSpendingInfo} (${name})`;
      }
      return savingSpendingInfo;
    }
    return name;
  }

  get asTableData(): TableData {
    return {
      id: this.id,
      name: this.tableDataName,
      cost:
        this.cost !== null
          ? {
              value: this.cost,
              isSubscription: this.subscription !== null,
              isUpcomingSubscription: false,
            }
          : null,
      source: this.source?.name ?? "",
      category: this.category.name,
      subcategory: this.subcategory?.name ?? null,
      date: this.date.format(DATE_FORMAT),
      categoryId: this.category.id,
      categoryShortname: this.category.shortname,
      isUpcomingSubscription: false,
    };
  }

  get personalExpense(): Expense | null {
    if (this.personalExpenseId === null) {
      return null;
    }
    return dataStores.expenseStore.getById(this.personalExpenseId) ?? null;
  }
}
