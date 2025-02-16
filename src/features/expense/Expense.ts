import { type ExpenseComponent as ExpenseComponentApi } from "@prisma/client";
import { type Dayjs } from "dayjs";
import type Decimal from "decimal.js";
import { DATE_FORMAT } from "~/utils/constants";
import { decimalSum } from "~/utils/decimalSum";
import type Category from "../category/Category";
import type Subcategory from "../category/Subcategory";
import type SavingSpending from "../savingSpending/SavingSpending";
import type SavingSpendingCategory from "../savingSpending/SavingSpendingCategory";
import type Source from "../source/Source";
import type Subscription from "../subscription/Subscription";
import type { ExpenseComponent } from "./ExpenseComponent";

export interface CostCol {
  value: Decimal;
  isSubscription?: boolean;
  isUpcomingSubscription?: boolean;
  parentExpenseName?: string;
  costWithComponents?: Decimal;
}

export interface ExpenseTableData {
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
  components: ExpenseComponent[];
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
  peHash: string | null;

  constructor(
    id: number,
    cost: Decimal,
    components: ExpenseComponent[],
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
    actualDate: Dayjs | null,
    peHash: string | null
  ) {
    this.id = id;
    this.cost = cost;
    this.components = components;
    this.date = date;
    this.category = category;
    this.subcategory = subcategory;
    this.name = name;
    this.source = source;
    this.subscription = subscription;
    this.savingSpending = savingSpending;
    this.actualDate = actualDate;
    this.peHash = peHash;
  }

  setComponents(components: ExpenseComponent[]) {
    this.components = components;
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

  get asTableData(): ExpenseTableData {
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
