import type { Dayjs } from "dayjs";
import type Decimal from "decimal.js";
import { makeAutoObservable } from "mobx";
import { dataStores } from "~/stores/dataStores";

export class ParsedExpense {
  date: Dayjs;
  type: string;
  description: string;
  amount: Decimal;
  hash: string;

  constructor(
    date: Dayjs,
    type: string,
    description: string,
    amount: Decimal,
    hash: string
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.date = date;
    this.type = type;
    this.description = description;
    this.amount = amount;
    this.hash = hash;
  }

  get alreadyExists(): boolean {
    return (
      dataStores.expenseStore.expensesHashes.includes(this.hash) ||
      dataStores.expenseStore.expenses.some(
        (e) =>
          (e.date.isSame(this.date, "day") ||
            e.actualDate?.isSame(this.date, "day")) &&
          e.cost.eq(this.amount.negated())
      )
    );
  }
}

export interface ParsedExpenseFromApi {
  date: string;
  type: string;
  description: string;
  amount: string;
  hash: string;
}
