import { type ExpenseComponent as ExpenseComponentApi } from "@prisma/client";
import type Decimal from "decimal.js";
import { makeAutoObservable, observable } from "mobx";
import { DATE_FORMAT } from "~/utils/constants";
import type Category from "./Category";
import type Expense from "./Expense";
import { type ExpenseComponentData, type TableData } from "./Expense";
import type Subcategory from "./Subcategory";

export class ExpenseComponent implements ExpenseComponentApi {
  id: number;
  name: string;
  cost: Decimal;
  category: Category;
  subcategory: Subcategory | null;

  constructor(
    id: number,
    name: string,
    cost: Decimal,
    category: Category,
    subcategory: Subcategory | null,
    public parentExpense: Expense
  ) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.category = category;
    this.subcategory = subcategory;
    makeAutoObservable(this, { subcategory: observable }, { autoBind: true });
  }

  get expenseId() {
    return this.parentExpense.id;
  }

  get subcategoryId() {
    return this.subcategory?.id ?? null;
  }

  get tableName(): string {
    if (this.name) {
      if (this.parentExpense.name) {
        return `${this.name} (часть от "${this.parentExpense.name}")`;
      }
      return this.name;
    }
    if (this.parentExpense.name) {
      return `Часть от "${this.parentExpense.name}"`;
    }
    return "";
  }

  get asTableData(): TableData {
    return {
      id: this.id,
      name: this.tableName,
      cost:
        this.cost !== null
          ? {
              value: this.cost,
              isSubscription: false,
              isUpcomingSubscription: false,
              parentExpenseName: this.parentExpense.name,
            }
          : null,
      date: this.parentExpense.date.format(DATE_FORMAT),
      category: this.category.name,
      categoryIcon: this.category.icon,
      categoryId: this.categoryId,
      categoryShortname: this.parentExpense.category.shortname,
      subcategory: this.subcategory?.name ?? null,
      subcategoryId: this.subcategoryId,
      source: this.parentExpense.source?.name ?? "",
      isUpcomingSubscription: false,
      expenseId: this.expenseId,
      isIncome: this.category.isIncome,
      isContinuous: this.category.isContinuous,
    };
  }

  get categoryId(): number {
    return this.category.id;
  }

  get asData(): ExpenseComponentData {
    return {
      id: this.id,
      name: this.name,
      cost: this.cost,
      categoryId: this.categoryId,
      subcategoryId: this.subcategoryId,
    };
  }

  get asApi(): ExpenseComponentApi {
    return {
      ...this.asData,
      expenseId: this.expenseId,
    };
  }
}
