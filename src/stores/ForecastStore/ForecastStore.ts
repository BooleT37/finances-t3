import sum from "lodash/sum";
import { makeAutoObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import { adaptForecastFromApi } from "~/adapters/forecast/forecastFromApi";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import countUniqueMonths from "~/utils/countUniqueMonths";
import roundCost from "~/utils/roundCost";

import type { Forecast as ApiForecast } from "@prisma/client";
import type Category from "~/models/Category";
import Forecast from "~/models/Forecast";
import { trpc } from "~/utils/api";
import { negateIf } from "~/utils/negateIf";
import type { DataLoader } from "../dataStores";
import { dataStores } from "../dataStores/DataStores";
import { type ForecastTableItem } from "./types";
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

  tableData = computedFn(
    (
      year: number,
      month: number,
      isIncome: boolean,
      isPersonal: boolean,
      isSavings: boolean
    ): ForecastTableItem[] => {
      const filtered = this.forecasts.filter((forecast) => {
        return (
          forecast.month === month &&
          forecast.year === year &&
          forecast.category.isIncome === isIncome &&
          forecast.category.isPersonal === isPersonal &&
          forecast.category.isSavings === isSavings
        );
      });

      let filteredCategories: Category[];

      const {
        incomeCategories,
        personalExpensesCategories,
        savingsCategories,
        generalExpenseCategories,
      } = dataStores.categoriesStore;

      if (isIncome) {
        filteredCategories = incomeCategories;
      } else if (isPersonal) {
        filteredCategories = personalExpensesCategories;
      } else if (isSavings) {
        filteredCategories = savingsCategories;
      } else {
        filteredCategories = generalExpenseCategories;
      }
      filteredCategories
        .sort((a, b) => a.id - b.id)
        .forEach((category) => {
          if (filtered.every((f) => f.category.id !== category.id)) {
            filtered.push(new Forecast(category, month, year, 0));
          }
        });
      const data = filtered.map((forecast) => {
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
          )?.sum ?? 0;

        const lastMonthSpendings = dataStores.expenseStore.totalPerMonth({
          year: prevYear,
          month: prevMonth,
          isIncome,
          categoryId: forecast.category.id,
        });

        const thisMonthSpendings = dataStores.expenseStore.totalPerMonth({
          year,
          month,
          isIncome,
          categoryId: forecast.category.id,
        });

        const { toSavings } = forecast.category;

        return {
          category: forecast.category.name,
          categoryId: forecast.category.id,
          categoryShortname: forecast.category.shortname,
          categoryType: forecast.category.type,
          average: avgForNonEmpty(
            Object.values(
              dataStores.expenseStore.expensesAndComponents
                .filter((e) => e.category.id === forecast.category.id)
                .reduce<Record<string, number>>((a, c) => {
                  const month = c.date.format(MONTH_DATE_FORMAT);
                  if (a[month] !== undefined) {
                    a[month] += c.cost ?? 0;
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
              ? 0
              : negateIf(
                  roundCost(lastMonthForecast - lastMonthSpendings),
                  isIncome || toSavings
                ),
            isIncome: forecast.category.isIncome,
          },
          thisMonth: {
            spendings: thisMonthSpendings,
            diff: forecast.category.fromSavings
              ? 0
              : negateIf(
                  roundCost(forecast.sum - thisMonthSpendings),
                  isIncome || toSavings
                ),
            isIncome: forecast.category.isIncome,
          },
          sum: {
            value: forecast.category.fromSavings ? null : forecast.sum,
            subscriptions:
              dataStores.subscriptionStore.getSubscriptionsForForecast(
                month,
                year,
                forecast.category
              ),
          },
          comment: forecast.comment || "",
        };
      });

      if (!isPersonal) {
        data.push({
          average: roundCost(sum(data.map((d) => d.average))),
          monthsWithSpendings: "",
          category: "Всего",
          categoryId: -1,
          categoryShortname: "Всего",
          categoryType: null,
          comment: "",
          lastMonth: {
            spendings: roundCost(
              sum(
                data.map((d) =>
                  negateIf(
                    d.lastMonth.spendings,
                    d.categoryType === "FROM_SAVINGS"
                  )
                )
              )
            ),
            diff: isSavings
              ? 0
              : roundCost(sum(data.map((d) => d.lastMonth.diff))),
            isIncome: false,
          },
          sum: {
            value: isSavings
              ? null
              : roundCost(
                  sum(
                    data.map((d) =>
                      negateIf(
                        d.sum.value ?? 0,
                        d.categoryType === "FROM_SAVINGS"
                      )
                    )
                  )
                ),
            subscriptions: isIncome
              ? []
              : dataStores.subscriptionStore.getSubscriptionsForForecast(
                  month,
                  year,
                  null
                ),
          },
          thisMonth: {
            spendings: roundCost(
              sum(
                data.map((d) =>
                  negateIf(
                    d.thisMonth.spendings,
                    d.categoryType === "FROM_SAVINGS"
                  )
                )
              )
            ),
            diff: isSavings
              ? 0
              : roundCost(sum(data.map((d) => d.thisMonth.diff))),
            isIncome: false,
          },
        });
      }

      return data;
    }
  );

  totalForMonth(year: number, month: number, isIncome: boolean) {
    return sum(
      this.forecasts
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
    (year: number, month: number): Record<number, number> => {
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
    sum: number
  ): Promise<Forecast> {
    const forecast = this.forecasts.find(
      (f) =>
        f.category.id === category.id && f.month === month && f.year === year
    );
    if (forecast) {
      forecast.sum = sum;
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
      0,
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
    const prevMonthSpends = roundCost(
      dataStores.expenseStore.totalPerMonth({
        year: prevYear,
        month: prevMonth,
        categoryId,
        isIncome: false,
      })
    );

    const correctedSum = roundCost(
      prevMonthForecast.sum - prevMonthSpends + pePerMonth
    );
    return this.changeForecastSum(category, month, year, correctedSum);
  }
}
