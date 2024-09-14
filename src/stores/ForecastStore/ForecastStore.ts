import { makeAutoObservable, observable, runInAction } from "mobx";
import { computedFn } from "mobx-utils";
import { adaptForecastFromApi } from "~/adapters/forecast/forecastFromApi";

import type { Forecast as ApiForecast } from "@prisma/client";
import Decimal from "decimal.js";
import { isNil } from "lodash";
import type Category from "~/models/Category";
import Forecast, { generateForecastTableId } from "~/models/Forecast";
import Subcategory from "~/models/Subcategory";
import { trpc } from "~/utils/api";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import countUniqueMonths from "~/utils/countUniqueMonths";
import { decimalSum } from "~/utils/decimalSum";
import { getPreviousMonth } from "~/utils/getPreviousMonth";
import { negateIf } from "~/utils/negateIf";
import { sortAllCategoriesById } from "../categoriesOrder";
import type { DataLoader } from "../dataStores";
import { dataStores } from "../dataStores/DataStores";
import { type ForecastTableItem, type ForecastTableItemGroup } from "./types";

function avgForNonEmpty(values: Decimal[]): Decimal {
  if (values.length === 0) {
    return new Decimal(0);
  }
  const filtered = values.filter((value) => !isNil(value));

  return decimalSum(...filtered).div(filtered.length);
}

export const REST_SUBCATEGORY_ID = -1;
export default class ForecastStore implements DataLoader<ApiForecast[]> {
  private allForecasts = observable.array<Forecast>();
  inited = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.forecast.getAll.query();
  }

  init(forecasts: ApiForecast[]) {
    this.allForecasts.replace(forecasts.map(adaptForecastFromApi));
    this.inited = true;
  }

  get categoriesForecasts() {
    return this.allForecasts.filter((f) => f.subcategory === null);
  }

  get subcategoriesForecasts() {
    return this.allForecasts.filter((f) => f.subcategory !== null);
  }

  getCategoryForecast({
    categoryId,
    month,
    year,
  }: {
    categoryId: number;
    month: number;
    year: number;
  }) {
    return this.categoriesForecasts.find(
      (f) =>
        f.category.id === categoryId && f.month === month && f.year === year
    );
  }

  getSubcategoryForecast({
    categoryId,
    subcategoryId,
    month,
    year,
  }: {
    categoryId: number;
    subcategoryId: number;
    month: number;
    year: number;
  }) {
    return this.subcategoriesForecasts.find(
      (f) =>
        f.category.id === categoryId &&
        f.subcategoryId === subcategoryId &&
        f.month === month &&
        f.year === year
    );
  }

  getCategoryOrSubcategoryForecast({
    categoryId,
    subcategoryId,
    month,
    year,
  }: {
    categoryId: number;
    subcategoryId: number | null;
    month: number;
    year: number;
  }) {
    return this.allForecasts.find(
      (f) =>
        f.category.id === categoryId &&
        (f.subcategory?.id ?? null) === subcategoryId &&
        f.month === month &&
        f.year === year
    );
  }

  private getSubRowsForForecast(forecast: Forecast): ForecastTableItem[] {
    const subRows = this.subcategoriesForecasts
      .filter(
        (f) =>
          f.category.id === forecast.category.id &&
          f.month === forecast.month &&
          f.year === forecast.year
      )
      .map((f) => this.forecastToTableItem({ forecast: f, isFake: false }));
    forecast.category.subcategories.forEach((subcategory) => {
      if (!subRows.some((f) => f.subcategoryId === subcategory.id)) {
        subRows.push(
          this.forecastToTableItem({
            forecast: new Forecast(
              forecast.category,
              subcategory,
              forecast.month,
              forecast.year,
              new Decimal(0),
              ""
            ),
            isFake: true,
          })
        );
      }
    });
    const subcategoryIdToIndex: Record<number, number> = Object.fromEntries(
      forecast.category.subcategories.map((subcategory, index) => [
        subcategory.id,
        index,
      ])
    );
    subRows.sort(
      (a, b) =>
        // all the ?? are just to make TS happy
        (subcategoryIdToIndex[a.subcategoryId ?? -1] ?? 0) -
        (subcategoryIdToIndex[b.subcategoryId ?? -1] ?? 0)
    );
    if (!subRows.every((f) => f.isFake)) {
      subRows.push(
        this.forecastToTableItem({
          forecast: new Forecast(
            forecast.category,
            new Subcategory(REST_SUBCATEGORY_ID, "Другое"),
            forecast.month,
            forecast.year,
            forecast.sum.minus(
              decimalSum(
                ...subRows.map((f) => f.sum).filter((sum) => sum !== null)
              )
            ),
            ""
          ),
          isFake: true,
        })
      );
    }
    return subRows;
  }

  private forecastToTableItem = ({
    forecast,
    subRows,
    isFake,
  }: {
    forecast: Forecast;
    subRows?: ForecastTableItem[];
    isFake?: boolean;
  }): ForecastTableItem => {
    const lastMonthForecast =
      this.getCategoryOrSubcategoryForecast({
        categoryId: forecast.category.id,
        subcategoryId: forecast.subcategoryId,
        month: forecast.previousMonth,
        year: forecast.previousYear,
      })?.sum ?? new Decimal(0);

    const lastMonthSpendings = dataStores.expenseStore.totalPerMonthForCategory(
      {
        year: forecast.previousYear,
        month: forecast.previousMonth,
        categoryId: forecast.category.id,
        subcategoryId: forecast.subcategoryId,
      }
    );

    const thisMonthSpendings = dataStores.expenseStore.totalPerMonthForCategory(
      {
        year: forecast.year,
        month: forecast.month,
        categoryId: forecast.category.id,
        subcategoryId: forecast.subcategoryId,
      }
    );

    const { toSavings, isIncome } = forecast.category;

    const group: ForecastTableItemGroup = forecast.category.isIncome
      ? "income"
      : forecast.category.isSavings
      ? "savings"
      : ("expense" as const);

    return {
      tableId: generateForecastTableId({
        group,
        categoryId: forecast.category.id,
        subcategoryId: forecast.subcategoryId,
      }),
      group,
      name: forecast.subcategory
        ? forecast.subcategory.name
        : forecast.category.shortname,
      categoryId: forecast.category.id,
      categoryType: forecast.category.type,
      subcategoryId: forecast.subcategoryId,
      average: avgForNonEmpty(
        Object.values(
          dataStores.expenseStore.expensesAndComponents
            .filter(
              (e) =>
                e.category.id === forecast.category.id &&
                e.subcategoryId === forecast.subcategoryId
            )
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
          .filter(
            (e) =>
              e.category.id === forecast.category.id &&
              e.subcategoryId === forecast.subcategoryId
          )
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
      sum: forecast.category.fromSavings ? null : forecast.sum,
      subscriptions: dataStores.subscriptionStore.getSubscriptionsForForecast(
        forecast.month,
        forecast.year,
        forecast.category.id,
        forecast.subcategoryId
      ),
      comment: forecast.comment ?? "",
      isFake,
      isRestRow: forecast.subcategoryId === REST_SUBCATEGORY_ID,
      subRows,
    };
  };

  tableData = computedFn(
    ({ year, month }: { year: number; month: number }): ForecastTableItem[] => {
      const thisMonthForecasts = this.categoriesForecasts
        .filter((forecast) => {
          return forecast.month === month && forecast.year === year;
        })
        .map((forecast) =>
          this.forecastToTableItem({
            forecast,
            subRows: this.getSubRowsForForecast(forecast),
            isFake: false,
          })
        );

      dataStores.categoriesStore.categories.forEach((category) => {
        if (thisMonthForecasts.every((f) => f.categoryId !== category.id)) {
          const fakeForecast = new Forecast(
            category,
            null,
            month,
            year,
            new Decimal(0),
            ""
          );
          thisMonthForecasts.push(
            this.forecastToTableItem({
              forecast: fakeForecast,
              subRows: this.getSubRowsForForecast(fakeForecast),
              isFake: true,
            })
          );
        }
      });

      thisMonthForecasts.sort((a, b) =>
        sortAllCategoriesById(a.categoryId ?? -1, b.categoryId ?? -1)
      );

      const expensesForecasts = thisMonthForecasts.filter(
        (f) => f.group === "expense"
      );

      const incomeForecasts = thisMonthForecasts.filter(
        (f) => f.group === "income"
      );

      const savingsForecasts = thisMonthForecasts.filter(
        (f) => f.group === "savings"
      );

      return [
        {
          name: "Расходы",
          tableId: generateForecastTableId({
            group: "expense",
            categoryId: null,
            subcategoryId: null,
          }),
          group: "expense",
          categoryId: null,
          categoryType: null,
          subcategoryId: null,
          average: decimalSum(...expensesForecasts.map((f) => f.average)),
          monthsWithSpendings: "",
          lastMonth: {
            spendings: decimalSum(
              ...expensesForecasts.map((f) => f.lastMonth.spendings)
            ),
            diff: decimalSum(...expensesForecasts.map((f) => f.lastMonth.diff)),
            isIncome: false,
          },
          thisMonth: {
            spendings: decimalSum(
              ...expensesForecasts.map((f) => f.thisMonth.spendings)
            ),
            diff: decimalSum(...expensesForecasts.map((f) => f.thisMonth.diff)),
            isIncome: false,
          },
          sum: decimalSum(
            ...expensesForecasts.map((f) => f.sum ?? new Decimal(0))
          ),
          subscriptions: expensesForecasts.flatMap((f) => f.subscriptions),
          comment: "",
          subRows: expensesForecasts,
        },
        {
          name: "Сбережения",
          tableId: generateForecastTableId({
            group: "savings",
            categoryId: null,
            subcategoryId: null,
          }),
          group: "savings",
          categoryId: null,
          categoryType: null,
          subcategoryId: null,
          average: decimalSum(...savingsForecasts.map((f) => f.average)),
          monthsWithSpendings: "",
          lastMonth: {
            spendings: decimalSum(
              ...savingsForecasts.map((f) => f.lastMonth.spendings)
            ),
            diff: decimalSum(...savingsForecasts.map((f) => f.lastMonth.diff)),
            isIncome: false,
          },
          thisMonth: {
            spendings: decimalSum(
              ...savingsForecasts.map((f) => f.thisMonth.spendings)
            ),
            diff: decimalSum(...savingsForecasts.map((f) => f.thisMonth.diff)),
            isIncome: false,
          },
          sum: decimalSum(
            ...savingsForecasts.map((f) => f.sum ?? new Decimal(0))
          ),
          subscriptions: savingsForecasts.flatMap((f) => f.subscriptions),
          comment: "",
          subRows: savingsForecasts,
        },
        {
          name: "Доходы",
          tableId: generateForecastTableId({
            group: "income",
            categoryId: null,
            subcategoryId: null,
          }),
          group: "income",
          categoryId: null,
          categoryType: null,
          subcategoryId: null,
          average: decimalSum(...incomeForecasts.map((f) => f.average)),
          monthsWithSpendings: "",
          lastMonth: {
            spendings: decimalSum(
              ...incomeForecasts.map((f) => f.lastMonth.spendings)
            ),
            diff: decimalSum(...incomeForecasts.map((f) => f.lastMonth.diff)),
            isIncome: true,
          },
          thisMonth: {
            spendings: decimalSum(
              ...incomeForecasts.map((f) => f.thisMonth.spendings)
            ),
            diff: decimalSum(...incomeForecasts.map((f) => f.thisMonth.diff)),
            isIncome: true,
          },
          sum: decimalSum(
            ...incomeForecasts.map((f) => f.sum ?? new Decimal(0))
          ),
          subscriptions: incomeForecasts.flatMap((f) => f.subscriptions),
          comment: "",
          subRows: incomeForecasts,
        },
      ];
    }
  );

  totalForMonth(year: number, month: number, isIncome: boolean) {
    return decimalSum(
      ...this.categoriesForecasts
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
        this.categoriesForecasts
          .filter((f) => f.month === month && f.year === year)
          .map((f) => [f.category.id, f.sum])
      );
      return forecast;
    }
  );

  async changeForecastSum(
    category: Category,
    subcategory: Subcategory | null,
    month: number,
    year: number,
    sum: Decimal
  ): Promise<Forecast> {
    const subcategoryId = subcategory?.id ?? null;
    const forecast = this.getCategoryOrSubcategoryForecast({
      categoryId: category.id,
      subcategoryId,
      month,
      year,
    });
    if (forecast) {
      if (!forecast.sum.eq(sum)) {
        forecast.sum = sum;
      }
    } else {
      this.allForecasts.push(
        new Forecast(category, subcategory, month, year, sum, "")
      );
    }
    const response = await trpc.forecast.upsert.mutate({
      categoryId: category.id,
      subcategoryId,
      month,
      year,
      sum,
    });
    return runInAction(() => adaptForecastFromApi(response));
  }

  async changeForecastComment(
    category: Category,
    subcategory: Subcategory | null,
    month: number,
    year: number,
    comment: string
  ): Promise<Forecast> {
    const subcategoryId = subcategory?.id ?? null;
    const forecast = this.getCategoryOrSubcategoryForecast({
      categoryId: category.id,
      subcategoryId,
      month,
      year,
    });
    const potentiallyNewForecast = new Forecast(
      category,
      subcategory,
      month,
      year,
      new Decimal(0),
      comment
    );
    if (forecast) {
      forecast.comment = comment;
    } else {
      this.allForecasts.push(potentiallyNewForecast);
    }
    const response = await trpc.forecast.upsert.mutate({
      categoryId: category.id,
      subcategoryId,
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
    const prevMonthForecast = this.getCategoryForecast({
      year: prevYear,
      month: prevMonth,
      categoryId: category.id,
    });
    if (!prevMonthForecast) {
      alert("Сначала заполните прогноз за прошлый месяц!");
      return;
    }
    const prevMonthSpends = dataStores.expenseStore.totalPerMonthForCategory({
      year: prevYear,
      month: prevMonth,
      categoryId,
      subcategoryId: null,
    });
    const correctedSum = prevMonthForecast.sum
      .minus(prevMonthSpends)
      .plus(pePerMonth ?? new Decimal(0));
    return this.changeForecastSum(category, null, month, year, correctedSum);
  }
}
