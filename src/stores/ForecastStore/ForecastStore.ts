import { makeAutoObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import { adaptForecastFromApi } from "~/adapters/forecast/forecastFromApi";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import countUniqueMonths from "~/utils/countUniqueMonths";

import type { Forecast as ApiForecast } from "@prisma/client";
import Decimal from "decimal.js";
import type Category from "~/models/Category";
import { TOTAL_ROW_CATEGORY_ID } from "~/models/Category";
import Forecast from "~/models/Forecast";
import { trpc } from "~/utils/api";
import { decimalSum } from "~/utils/decimalSum";
import { negateIf } from "~/utils/negateIf";
import type { DataLoader } from "../dataStores";
import { dataStores } from "../dataStores/DataStores";
import { type ForecastTableItem, type ForecastTableItemGroup } from "./types";
import { avgForNonEmpty, getPreviousMonth } from "./utils";

export default class ForecastStore implements DataLoader<ApiForecast[]> {
  public forecasts = observable.array<Forecast>();
  inited = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.forecast.getAll.query();
  }

  init(forecasts: ApiForecast[]) {
    this.forecasts.replace(forecasts.map(adaptForecastFromApi));
    this.inited = true;
  }

  find(year: number, month: number, category: Category) {
    return this.forecasts.find(
      (f) =>
        f.year === year && f.month === month && f.category.id === category.id
    );
  }

  private forecastToTableItem = ({
    forecast,
    year,
    month,
  }: {
    forecast: Forecast;
    year: number;
    month: number;
  }): ForecastTableItem => {
    const { month: prevMonth, year: prevYear } = getPreviousMonth(
      forecast.month,
      forecast.year
    );
    const lastMonthForecast =
      this.forecasts.find(
        ({ category, month, year }) =>
          category === forecast.category &&
          month === prevMonth &&
          year === prevYear
      )?.sum ?? new Decimal(0);

    const lastMonthSpendings = dataStores.expenseStore.totalPerMonthForCategory(
      {
        year: prevYear,
        month: prevMonth,
        categoryId: forecast.category.id,
      }
    );

    const thisMonthSpendings = dataStores.expenseStore.totalPerMonthForCategory(
      {
        year,
        month,
        categoryId: forecast.category.id,
      }
    );

    const { toSavings, isIncome, isPersonal, isSavings } = forecast.category;
    const group: ForecastTableItemGroup = isIncome
      ? "income"
      : isPersonal
      ? "personal"
      : isSavings
      ? "savings"
      : "expense";

    return {
      group,
      category: forecast.category.name,
      categoryId: forecast.category.id,
      categoryShortname: forecast.category.shortname,
      categoryType: forecast.category.type,
      average: avgForNonEmpty(
        Object.values(
          dataStores.expenseStore.expensesAndComponents
            .filter((e) => e.category.id === forecast.category.id)
            .reduce<Record<string, Decimal>>((a, c) => {
              const month = c.date.format(MONTH_DATE_FORMAT);
              const averageForMonth = a[month];
              if (averageForMonth !== undefined) {
                a[month] = averageForMonth.plus(c.cost ?? new Decimal(0));
              } else {
                a[month] = c.cost ?? 0;
              }
              return a;
            }, {})
        )
      ),
      monthsWithSpendings: `${countUniqueMonths(
        dataStores.expenseStore.expensesAndComponents
          .filter((e) => e.category.id === forecast.category.id)
          .map((e) => e.date)
      )} / ${dataStores.expenseStore.totalMonths} месяцев`,
      lastMonth: {
        spendings: lastMonthSpendings,
        diff: forecast.category.fromSavings
          ? new Decimal(0)
          : negateIf(
              lastMonthForecast.minus(lastMonthSpendings),
              isIncome || toSavings
            ),
        isIncome,
      },
      thisMonth: {
        spendings: thisMonthSpendings,
        diff: forecast.category.fromSavings
          ? new Decimal(0)
          : negateIf(
              forecast.sum.minus(thisMonthSpendings),
              isIncome || toSavings
            ),
        isIncome: forecast.category.isIncome,
      },
      sum: {
        value: forecast.category.fromSavings ? null : forecast.sum,
        subscriptions: dataStores.subscriptionStore.getSubscriptionsForForecast(
          month,
          year,
          forecast.category
        ),
      },
      comment: forecast.comment || "",
    };
  };

  getTotalRow = (
    forecasts: ForecastTableItem[],
    group: ForecastTableItemGroup,
    month: number,
    year: number
  ): ForecastTableItem => ({
    group,
    average: decimalSum(...forecasts.map((d) => d.average)),
    monthsWithSpendings: "",
    category: "Всего",
    categoryId: TOTAL_ROW_CATEGORY_ID,
    categoryShortname: "Всего",
    categoryType: null,
    comment: "",
    lastMonth: {
      spendings: decimalSum(
        ...forecasts.map((f) =>
          negateIf(f.lastMonth.spendings, f.categoryType === "FROM_SAVINGS")
        )
      ),
      diff:
        group === "savings"
          ? new Decimal(0)
          : decimalSum(...forecasts.map((f) => f.lastMonth.diff)),
      isIncome: false,
    },
    sum: {
      value:
        group === "savings"
          ? null
          : decimalSum(
              ...forecasts.map((f) =>
                negateIf(
                  f.sum.value ?? new Decimal(0),
                  f.categoryType === "FROM_SAVINGS"
                )
              )
            ),
      subscriptions:
        group === "income"
          ? []
          : dataStores.subscriptionStore.getSubscriptionsForForecast(
              month,
              year,
              null
            ),
    },
    thisMonth: {
      spendings: decimalSum(
        ...forecasts.map((а) =>
          negateIf(а.thisMonth.spendings, а.categoryType === "FROM_SAVINGS")
        )
      ),
      diff:
        group === "savings"
          ? new Decimal(0)
          : decimalSum(...forecasts.map((f) => f.thisMonth.diff)),
      isIncome: false,
    },
  });

  tableData = computedFn(
    ({ year, month }: { year: number; month: number }): ForecastTableItem[] => {
      const filtered = this.forecasts.filter((forecast) => {
        return forecast.month === month && forecast.year === year;
      });

      dataStores.categoriesStore.categories
        .slice()
        .sort((a, b) => a.id - b.id)
        .forEach((category) => {
          if (filtered.every((f) => f.category.id !== category.id)) {
            filtered.push(new Forecast(category, month, year, new Decimal(0)));
          }
        });

      const data: ForecastTableItem[] = filtered.map((forecast) =>
        this.forecastToTableItem({ forecast, year, month })
      );

      const groups: ForecastTableItemGroup[] = [
        "expense",
        "income",
        "personal",
        "savings",
      ];

      data.push(
        ...groups.map((group) =>
          this.getTotalRow(
            data.filter((d) => d.group === "expense"),
            group,
            month,
            year
          )
        )
      );

      return data;
    }
  );

  totalForMonth(year: number, month: number, isIncome: boolean) {
    return decimalSum(
      ...this.forecasts
        .filter(
          (forecast) =>
            forecast.month === month &&
            forecast.year === year &&
            forecast.category.isIncome === isIncome &&
            !forecast.category.fromSavings
        )
        .map((f) => f.sum)
    );
  }

  categoriesForecast = computedFn(
    (year: number, month: number): Record<number, Decimal> => {
      const forecast = Object.fromEntries(
        this.forecasts
          .filter((f) => f.month === month && f.year === year)
          .map((f) => [f.category.id, f.sum])
      );
      return forecast;
    }
  );

  async changeForecastSum(
    category: Category,
    month: number,
    year: number,
    sum: Decimal
  ): Promise<Forecast> {
    const forecast = this.forecasts.find(
      (f) =>
        f.category.id === category.id && f.month === month && f.year === year
    );
    if (forecast) {
      if (!forecast.sum.eq(sum)) {
        forecast.sum = sum;
      }
    } else {
      this.forecasts.push(new Forecast(category, month, year, sum, ""));
    }
    const response = await trpc.forecast.upsert.mutate({
      categoryId: category.id,
      month,
      year,
      sum,
    });
    return adaptForecastFromApi(response);
  }

  async changeForecastComment(
    category: Category,
    month: number,
    year: number,
    comment: string
  ): Promise<Forecast> {
    const forecast = this.forecasts.find(
      (f) =>
        f.category.id === category.id && f.month === month && f.year === year
    );
    const potentiallyNewForecast = new Forecast(
      category,
      month,
      year,
      new Decimal(0),
      comment
    );
    if (forecast) {
      forecast.comment = comment;
    } else {
      this.forecasts.push(potentiallyNewForecast);
    }
    const response = await trpc.forecast.upsert.mutate({
      categoryId: category.id,
      month,
      year,
      comment,
    });
    return adaptForecastFromApi(response);
  }

  async transferPersonalExpense(
    categoryId: number,
    month: number,
    year: number
  ): Promise<Forecast | undefined> {
    const { pePerMonth } = dataStores.userSettingsStore;
    const category = dataStores.categoriesStore.getById(categoryId);
    const { month: prevMonth, year: prevYear } = getPreviousMonth(month, year);
    const prevMonthForecast = this.find(prevYear, prevMonth, category);
    if (!prevMonthForecast) {
      alert("Сначала заполните прогноз за прошлый месяц!");
      return;
    }
    const prevMonthSpends = dataStores.expenseStore.totalPerMonthForCategory({
      year: prevYear,
      month: prevMonth,
      categoryId,
    });
    const correctedSum = prevMonthForecast.sum
      .minus(prevMonthSpends)
      .plus(pePerMonth ?? new Decimal(0));
    return this.changeForecastSum(category, month, year, correctedSum);
  }
}
