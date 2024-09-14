import dayjs, { type Dayjs } from "dayjs";
import type Decimal from "decimal.js";
import { makeAutoObservable, observable } from "mobx";
import { trpc } from "~/utils/api";
import costToString from "~/utils/costToString";
import type Category from "./Category";
import type Source from "./Source";
import type Subcategory from "./Subcategory";

const today = dayjs();

export interface SubscriptionFormValues {
  id: number;
  name: string;
  cost: string;
  categoryId: number | null;
  period: number;
  firstDate: Dayjs | null;
  source: number | null;
}

export default class Subscription {
  static periodToString(period: number): string {
    if (period === 1) {
      return "мес";
    }
    if (period === 3) {
      return "квартал";
    }
    if (period === 12) {
      return "год";
    }
    return `${period} мес`;
  }

  id: number;
  name: string;
  cost: Decimal;
  category: Category;
  subcategory: Subcategory | null;
  period: number;
  firstDate: Dayjs;
  active: boolean;
  source: Source | null;

  constructor(
    id: number,
    name: string,
    cost: Decimal,
    category: Category,
    subcategory: Subcategory | null,
    period: number,
    firstDate: Dayjs,
    active: boolean,
    source: Source | null = null
  ) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.category = category;
    this.subcategory = subcategory;
    this.period = period;
    this.firstDate = firstDate;
    this.source = source;
    this.active = active;
    makeAutoObservable(
      this,
      { subcategory: observable, source: observable },
      { autoBind: true }
    );
  }

  get costString(): string {
    return `${costToString(this.cost)}/${Subscription.periodToString(
      this.period
    )}`;
  }

  get subcategoryId(): number | null {
    return this.subcategory?.id ?? null;
  }

  get nextDate(): Dayjs {
    let date = this.firstDate.clone();
    while (date.isBefore(today, "day")) {
      date = date.add(this.period, "months");
    }
    return date;
  }

  get toFormValues(): SubscriptionFormValues {
    return {
      id: this.id,
      name: this.name,
      cost: this.cost.toFixed(2),
      categoryId: this.category.id ?? null,
      period: this.period,
      firstDate: this.firstDate,
      source: this.source?.id ?? null,
    };
  }

  get costPerMonth(): Decimal {
    return this.cost.div(this.period);
  }

  async setActive(active: boolean) {
    this.active = active;

    await trpc.sub.toggle.mutate({ active, id: this.id });
  }

  isInMonth(month: number, year: number): boolean {
    const date = dayjs().year(year).month(month);
    let iDate = this.firstDate.clone();
    while (iDate.isBefore(date, "month")) {
      iDate = iDate.add(this.period, "months");
    }
    return date.isSame(iDate, "month");
  }

  firstDateInInterval(startDate: Dayjs, endDate: Dayjs): Dayjs | null {
    let iDate = this.firstDate.clone();
    while (iDate.isBefore(startDate, "day")) {
      iDate = iDate.add(this.period, "months");
    }
    if (iDate.isBetween(startDate, endDate, "day", "[]")) {
      return iDate;
    }
    return null;
  }
}
