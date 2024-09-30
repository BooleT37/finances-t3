import type Decimal from "decimal.js";
import { action } from "mobx";
import type Expense from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import { decimalSum } from "~/utils/decimalSum";

interface Params {
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  isSubcategoryRow: boolean;
  month: number;
  year: number;
  isIncome: boolean;
}

export const getCostForecast = action(
  ({
    categoryId,
    subcategoryId,
    isSubcategoryRow,
    month,
    year,
    isIncome,
  }: Params): Decimal | undefined => {
    if (categoryId === undefined) {
      return decimalSum(
        ...dataStores.forecastStore.categoriesForecasts
          .filter(
            (f) =>
              f.month === month &&
              f.year === year &&
              f.category.isIncome === isIncome
          )
          .map((f) => f.sum)
      );
    }
    const { fromSavings: isSavingSpending } =
      dataStores.categoriesStore.getById(categoryId);
    if (isSavingSpending) {
      return decimalSum(
        ...dataStores.expenseStore.expenses
          .filter(
            (
              expense
            ): expense is Expense & {
              savingSpending: NonNullable<Expense["savingSpending"]>;
            } =>
              expense.savingSpending !== null &&
              expense.date.month() === month &&
              expense.date.year() === year
          )
          .map((expense) => expense.savingSpending.category.forecast)
      );
    }
    if (isSubcategoryRow) {
      if (subcategoryId === undefined) {
        return dataStores.forecastStore.getRestForecastSum({
          categoryId,
          month,
          year,
        });
      } else {
        return dataStores.forecastStore.getSubcategoryForecast({
          categoryId,
          subcategoryId,
          month,
          year,
        })?.sum;
      }
    }
    return dataStores.forecastStore.getCategoryForecast({
      categoryId,
      month,
      year,
    })?.sum;
  }
);
