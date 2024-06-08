import { type ExpenseComponent as ExpenseComponentApi } from "@prisma/client";
import { type Dayjs } from "dayjs";
import { makeAutoObservable, observable } from "mobx";
import { dataStores } from "~/stores/dataStores";
import { DATE_FORMAT } from "~/utils/constants";
import type Category from "./Category";
import { ExpenseComponent } from "./ExpenseComponent";
import type SavingSpending from "./SavingSpending";
import type SavingSpendingCategory from "./SavingSpendingCategory";
import type Source from "./Source";
import type Subcategory from "./Subcategory";
import type Subscription from "./Subscription";

export interface CostCol {
  value: number;
  isSubscription?: boolean;
  isUpcomingSubscription?: boolean;
  parentExpenseName?: string;
  costWithComponents?: number;
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
  parentExpenseId: number | null;
}

export default class Expense {
  id: number;
  name: string;
  cost: number;
  components = observable.array<ExpenseComponent>();
  date: Dayjs;
  category: Category;
  subcategory: Subcategory | null;
  source: Source | null;
  subscription: Subscription | null;
  savingSpending: {
    spending: SavingSpending;
    category: SavingSpendingCategory;
  } | null;

  constructor(
    id: number,
    cost: number,
    components: ExpenseComponentApi[],
    date: Dayjs,
    category: Category,
    subcategory: Subcategory | null,
    name: string,
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
    this.components.replace(
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
            this
          )
      )
    );
    this.date = date;
    this.category = category;
    this.subcategory = subcategory;
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

  get costWithoutComponents(): number {
    return this.cost - this.components.reduce((acc, c) => acc + c.cost, 0);
  }

  get asTableData(): TableData {
    return {
      id: this.id,
      name: this.tableDataName,
      cost:
        this.cost !== null
          ? {
              value: this.costWithoutComponents,
              isSubscription: this.subscription !== null,
              isUpcomingSubscription: false,
              costWithComponents:
                this.components.length > 0 ? this.cost : undefined,
            }
          : null,
      source: this.source?.name ?? "",
      category: this.category.name,
      subcategory:
        this.savingSpending?.spending.name ?? this.subcategory?.name ?? null,
      date: this.date.format(DATE_FORMAT),
      categoryId: this.category.id,
      categoryShortname: this.category.shortname,
      isUpcomingSubscription: false,
      parentExpenseId: null,
    };
  }
}
