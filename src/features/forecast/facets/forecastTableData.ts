import Decimal from "decimal.js";
import { useMemo } from "react";
import { useCategories } from "~/features/category/facets/allCategories";
import { useSortAllCategoriesById } from "~/features/category/facets/categoriesOrder";
import Subcategory from "~/features/category/Subcategory";
import { useExpenses } from "~/features/expense/facets/allExpenses";
import { useExpensesAndComponents } from "~/features/expense/facets/expensesAndComponents";
import {
  useGetTotalPerMonthForCategory,
  useGetTotalPerMonthForSubcategory,
} from "~/features/expense/facets/expenseTotals";
import { useGetTotalExpensesMonths } from "~/features/expense/facets/totalMonths";
import { useGetTotalExpensesPerMonth } from "~/features/expense/facets/totalPerMonth";
import { useSubscriptions } from "~/features/subscription/facets/allSubscriptions";
import { useGetSubscriptionsForForecast } from "~/features/subscription/facets/subscriptionsForForecast";
import { MONTH_DATE_FORMAT } from "~/utils/constants";
import countUniqueMonths from "~/utils/countUniqueMonths";
import { decimalSum } from "~/utils/decimalSum";
import Forecast, { generateForecastTableId } from "../Forecast";
import type { ForecastTableItem, ForecastTableItemGroup } from "../types";
import { useCategoryForecasts } from "./categoryForecasts";
import { useGetCategoryOrSubcategoryForecast } from "./categoryOrSubcategoryForecast";
import { REST_SUBCATEGORY_ID } from "./forecastConstants";
import { useGetForecastsTotalForMonth } from "./forecastsTotalForMonth";
import { useSubcategoryForecasts } from "./subcategoryForecasts";

function useGetSubRowsForForecast() {
  const subcategoriesForecasts = useSubcategoryForecasts() ?? [];
  const forecastToTableItem = useForecastToTableItem();

  return (forecast: Forecast): ForecastTableItem[] => {
    const subRows = subcategoriesForecasts
      .filter(
        (f) =>
          f.category.id === forecast.category.id &&
          f.month === forecast.month &&
          f.year === forecast.year
      )
      .map((f) => forecastToTableItem({ forecast: f, isFake: false }));
    forecast.category.subcategories.forEach((subcategory) => {
      if (!subRows.some((f) => f.subcategoryId === subcategory.id)) {
        subRows.push(
          forecastToTableItem({
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
        forecastToTableItem({
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
  };
}

function useForecastToTableItem() {
  const getCategoryOrSubcategoryForecast =
    useGetCategoryOrSubcategoryForecast();
  const getTotalPerMonthForCategory = useGetTotalPerMonthForCategory();
  const getTotalPerMonthForSubcategory = useGetTotalPerMonthForSubcategory();
  const expensesAndComponents = useExpensesAndComponents() ?? [];
  const getTotalExpensesMonths = useGetTotalExpensesMonths();
  const getSubscriptionsForForecast = useGetSubscriptionsForForecast();

  return ({
    forecast,
    subRows,
    isFake,
  }: {
    forecast: Forecast;
    subRows?: ForecastTableItem[];
    isFake?: boolean;
  }): ForecastTableItem => {
    const lastMonthForecast =
      getCategoryOrSubcategoryForecast({
        categoryId: forecast.category.id,
        subcategoryId: forecast.subcategoryId,
        month: forecast.previousMonth,
        year: forecast.previousYear,
      })?.sum ?? new Decimal(0);

    const lastMonthSpendings =
      forecast.subcategoryId === null
        ? getTotalPerMonthForCategory({
            year: forecast.previousYear,
            month: forecast.previousMonth,
            categoryId: forecast.category.id,
          })
        : getTotalPerMonthForSubcategory({
            year: forecast.previousYear,
            month: forecast.previousMonth,
            categoryId: forecast.category.id,
            subcategoryId:
              forecast.subcategoryId === REST_SUBCATEGORY_ID
                ? null
                : forecast.subcategoryId,
          });

    const thisMonthSpendings =
      forecast.subcategoryId === null
        ? getTotalPerMonthForCategory({
            year: forecast.year,
            month: forecast.month,
            categoryId: forecast.category.id,
          })
        : getTotalPerMonthForSubcategory({
            year: forecast.year,
            month: forecast.month,
            categoryId: forecast.category.id,
            subcategoryId:
              forecast.subcategoryId === REST_SUBCATEGORY_ID
                ? null
                : forecast.subcategoryId,
          });

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
      icon: forecast.subcategory ? null : forecast.category.icon,
      categoryId: forecast.category.id,
      categoryType: forecast.category.type,
      subcategoryId: forecast.subcategoryId,
      average: avgForNonEmpty(
        Object.values(
          expensesAndComponents
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
        expensesAndComponents
          .filter(
            (e) =>
              e.category.id === forecast.category.id &&
              e.subcategoryId === forecast.subcategoryId
          )
          .map((e) => e.date)
      )} / ${getTotalExpensesMonths()} месяцев`,
      lastMonth: {
        spendings: lastMonthSpendings,
        diff: forecast.category.fromSavings
          ? new Decimal(0)
          : lastMonthSpendings.minus(lastMonthForecast),
      },
      thisMonth: {
        spendings: thisMonthSpendings,
        diff: forecast.category.fromSavings
          ? new Decimal(0)
          : thisMonthSpendings.minus(forecast.sum),
      },
      sum: forecast.category.fromSavings ? null : forecast.sum,
      subscriptions: getSubscriptionsForForecast(
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
}

function avgForNonEmpty(values: Decimal[]): Decimal {
  if (values.length === 0) {
    return new Decimal(0);
  }
  const filtered = values.filter((value) => value !== null);
  return decimalSum(...filtered).div(filtered.length);
}

const emptyMonth = {
  spendings: new Decimal(0),
  diff: new Decimal(0),
};

const baseRootRow = {
  icon: null,
  categoryId: null,
  categoryType: null,
  subcategoryId: null,
  average: new Decimal(0),
  monthsWithSpendings: "",
  lastMonth: emptyMonth,
  thisMonth: emptyMonth,
  sum: new Decimal(0),
  subscriptions: [],
  comment: "",
  subRows: [],
};

const expensesRootRow: ForecastTableItem = {
  ...baseRootRow,
  name: "Расходы",
  tableId: generateForecastTableId({
    group: "expense",
    categoryId: null,
    subcategoryId: null,
  }),
  group: "expense",
};

const savingsRootRow: ForecastTableItem = {
  ...baseRootRow,
  name: "Сбережения",
  tableId: generateForecastTableId({
    group: "savings",
    categoryId: null,
    subcategoryId: null,
  }),
  group: "savings",
};

const incomeRootRow: ForecastTableItem = {
  ...baseRootRow,
  name: "Доходы",
  tableId: generateForecastTableId({
    group: "income",
    categoryId: null,
    subcategoryId: null,
  }),
  group: "income",
};

const totalRootRow: ForecastTableItem = {
  ...baseRootRow,
  name: "Итого",
  tableId: generateForecastTableId({
    group: "total",
    categoryId: null,
    subcategoryId: null,
  }),
  group: "total",
};

const emptyRootRows: ForecastTableItem[] = [
  expensesRootRow,
  savingsRootRow,
  incomeRootRow,
  totalRootRow,
];

interface ForecastTableData {
  data: ForecastTableItem[];
  isLoaded: boolean;
}

export const useForecastTableData = (
  year: number,
  month: number
): ForecastTableData => {
  const categoriesForecasts = useCategoryForecasts();
  const { data: expenses } = useExpenses();
  const { data: subscriptions } = useSubscriptions();
  const forecastToTableItem = useForecastToTableItem();
  const getSubRowsForForecast = useGetSubRowsForForecast();
  const { data: categories = [] } = useCategories();
  const sortAllCategoriesById = useSortAllCategoriesById();
  const getTotalExpensesPerMonth = useGetTotalExpensesPerMonth();
  const getForecastsTotalForMonth = useGetForecastsTotalForMonth();

  return useMemo<ForecastTableData>(() => {
    if (!categoriesForecasts || !expenses || !subscriptions) {
      return { data: emptyRootRows, isLoaded: false };
    }

    const thisMonthForecasts = categoriesForecasts
      .filter((forecast) => forecast.month === month && forecast.year === year)
      .map((forecast) =>
        forecastToTableItem({
          forecast,
          subRows: getSubRowsForForecast(forecast),
          isFake: false,
        })
      );

    categories.forEach((category) => {
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
          forecastToTableItem({
            forecast: fakeForecast,
            subRows: getSubRowsForForecast(fakeForecast),
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

    const thisMonthTotal = getTotalExpensesPerMonth({
      year,
      month,
      excludeTypes: ["FROM_SAVINGS"],
    });

    const sumTotal = getForecastsTotalForMonth(year, month);

    const data: ForecastTableItem[] = [
      {
        ...expensesRootRow,
        average: decimalSum(...expensesForecasts.map((f) => f.average)),
        lastMonth: {
          spendings: decimalSum(
            ...expensesForecasts.map((f) => f.lastMonth.spendings)
          ),
          diff: decimalSum(...expensesForecasts.map((f) => f.lastMonth.diff)),
        },
        thisMonth: {
          spendings: decimalSum(
            ...expensesForecasts.map((f) => f.thisMonth.spendings)
          ),
          diff: decimalSum(...expensesForecasts.map((f) => f.thisMonth.diff)),
        },
        sum: decimalSum(
          ...expensesForecasts.map((f) => f.sum ?? new Decimal(0))
        ),
        subscriptions: expensesForecasts.flatMap((f) => f.subscriptions),
        subRows: expensesForecasts,
      },
      {
        ...savingsRootRow,
        average: decimalSum(...savingsForecasts.map((f) => f.average)),
        lastMonth: {
          spendings: decimalSum(
            ...savingsForecasts.map((f) => f.lastMonth.spendings)
          ),
          diff: decimalSum(...savingsForecasts.map((f) => f.lastMonth.diff)),
        },
        thisMonth: {
          spendings: decimalSum(
            ...savingsForecasts.map((f) => f.thisMonth.spendings)
          ),
          diff: decimalSum(...savingsForecasts.map((f) => f.thisMonth.diff)),
        },
        sum: decimalSum(
          ...savingsForecasts.map((f) => f.sum ?? new Decimal(0))
        ),
        subscriptions: savingsForecasts.flatMap((f) => f.subscriptions),
        subRows: savingsForecasts,
      },
      {
        ...incomeRootRow,
        average: decimalSum(...incomeForecasts.map((f) => f.average)),
        lastMonth: {
          spendings: decimalSum(
            ...incomeForecasts.map((f) => f.lastMonth.spendings)
          ),
          diff: decimalSum(...incomeForecasts.map((f) => f.lastMonth.diff)),
        },
        thisMonth: {
          spendings: decimalSum(
            ...incomeForecasts.map((f) => f.thisMonth.spendings)
          ),
          diff: decimalSum(...incomeForecasts.map((f) => f.thisMonth.diff)),
        },
        sum: decimalSum(...incomeForecasts.map((f) => f.sum ?? new Decimal(0))),
        subscriptions: incomeForecasts.flatMap((f) => f.subscriptions),
        subRows: incomeForecasts,
      },
      {
        ...totalRootRow,
        average: decimalSum(
          ...thisMonthForecasts.map((f) => f.average ?? new Decimal(0))
        ),
        lastMonth: {
          spendings: decimalSum(
            ...thisMonthForecasts.map((f) => f.lastMonth.spendings)
          ),
          diff: decimalSum(...thisMonthForecasts.map((f) => f.lastMonth.diff)),
        },
        thisMonth: {
          spendings: thisMonthTotal,
          diff: thisMonthTotal.minus(sumTotal),
        },
        sum: sumTotal,
        subscriptions: thisMonthForecasts.flatMap((f) => f.subscriptions),
      },
    ];

    return { data, isLoaded: true };
  }, [
    categoriesForecasts,
    expenses,
    subscriptions,
    categories,
    getTotalExpensesPerMonth,
    year,
    month,
    getForecastsTotalForMonth,
    forecastToTableItem,
    getSubRowsForForecast,
    sortAllCategoriesById,
  ]);
};
