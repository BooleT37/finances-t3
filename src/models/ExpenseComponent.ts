import { type ExpenseComponent as ExpenseComponentApi } from "@prisma/client";
import type Decimal from "decimal.js";
import { makeAutoObservable } from "mobx";
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
    makeAutoObservable(this, {}, { autoBind: true });
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.category = category;
    this.subcategory = subcategory;
  }

  get expenseId() {
    return this.parentExpense.id;
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
              isIncome: this.category.isIncome,
            }
          : null,
      date: this.parentExpense.date.format(DATE_FORMAT),
      category: this.category.name,
      categoryId: this.categoryId,
      categoryShortname: this.parentExpense.category.shortname,
      subcategory: this.subcategory?.name ?? null,
      source: this.parentExpense.source?.name ?? "",
      isUpcomingSubscription: false,
      expenseId: this.expenseId,
      isIncome: this.category.isIncome,
    };
  }

  get categoryId(): number {
    return this.category.id;
  }

  get subcategoryId(): number | null {
    return this.subcategory?.id ?? null;
  }

  get asData(): ExpenseComponentData {
    return {
      id: this.id,
      name: this.name,
      cost: this.cost,
      categoryId: this.categoryId,
      subcategoryId: this.subcategory?.id ?? null,
    };
  }

  get asApi(): ExpenseComponentApi {
    return {
      ...this.asData,
      expenseId: this.expenseId,
    };
  }
}
