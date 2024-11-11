import { type ExpenseComponent as ExpenseComponentApi } from "@prisma/client";
import { type Dayjs } from "dayjs";
import type Decimal from "decimal.js";
import { makeAutoObservable, observable } from "mobx";
import { dataStores } from "~/stores/dataStores";
import { DATE_FORMAT } from "~/utils/constants";
import { decimalSum } from "~/utils/decimalSum";
import type Category from "./Category";
import { ExpenseComponent } from "./ExpenseComponent";
import type SavingSpending from "./SavingSpending";
import type SavingSpendingCategory from "./SavingSpendingCategory";
import type Source from "./Source";
import type Subcategory from "./Subcategory";
import type Subscription from "./Subscription";

export interface CostCol {
  value: Decimal;
  isSubscription?: boolean;
  isUpcomingSubscription?: boolean;
  parentExpenseName?: string;
  costWithComponents?: Decimal;
}

export interface TableData {
  id: number;
  name: string;
  cost: CostCol | null;
  date: string;
  category: string;
  categoryId: number;
  categoryShortname: string;
  categoryIcon: string | null;
  subcategory: string | null;
  subcategoryId: number | null;
  source: string;
  isUpcomingSubscription: boolean;
  expenseId: number | null;
  isIncome: boolean;
  isContinuous: boolean;
}

// for new expenses we don't have expense id
export type ExpenseComponentData = Omit<ExpenseComponentApi, "expenseId">;

export default class Expense {
  id: number;
  name: string;
  cost: Decimal;
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
  actualDate: Dayjs | null;

  constructor(
    id: number,
    cost: Decimal,
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
    } | null = null,
    actualDate: Dayjs | null
  ) {
    makeAutoObservable(this, { subcategory: observable }, { autoBind: true });
    this.id = id;
    this.cost = cost;
    this.replaceComponents(components);
    this.date = date;
    this.category = category;
    this.subcategory = subcategory;
    this.name = name;
    this.source = source;
    this.subscription = subscription;
    this.savingSpending = savingSpending;
    this.actualDate = actualDate;
  }

  replaceComponents(newComponents: ExpenseComponentData[]): void {
    this.components.replace(
      newComponents.map(
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
            this
          )
      )
    );
  }

  get subcategoryId(): number | null {
    return this.subcategory?.id ?? null;
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

  get costWithoutComponents(): Decimal {
    return this.cost.minus(decimalSum(...this.components.map((c) => c.cost)));
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
      categoryIcon: this.category.icon,
      subcategory:
        this.savingSpending?.spending.name ?? this.subcategory?.name ?? null,
      subcategoryId: this.subcategoryId,
      date: this.date.format(DATE_FORMAT),
      categoryId: this.category.id,
      categoryShortname: this.category.shortname,
      isUpcomingSubscription: false,
      expenseId: null,
      isIncome: this.category.isIncome,
      isContinuous: this.category.isContinuous,
    };
  }

  get calculatedActualDate() {
    return this.actualDate ?? this.date;
  }
}
