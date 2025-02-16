import type Decimal from "decimal.js";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import type Expense from "~/features/expense/Expense";
import { useExpenses } from "~/features/expense/facets/allExpenses";
import { useCategoryForecast } from "~/features/forecast/facets/categoryForecast";
import { useCategoryForecasts } from "~/features/forecast/facets/categoryForecasts";
import { useGetRestForecastSum } from "~/features/forecast/facets/restForecastSum";
import { useGetSubcategoryForecast } from "~/features/forecast/facets/subcategoryForecast";
import { decimalSum } from "~/utils/decimalSum";

interface Params {
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  isSubcategoryRow: boolean;
  month: number;
  year: number;
  isIncome: boolean;
}

export const useGetCostForecast = () => {
  const categoryForecasts = useCategoryForecasts();
  const getCategoryById = useGetCategoryById();
  const { data: expenses = [] } = useExpenses();
  const getRestForecastSum = useGetRestForecastSum();
  const getSubcategoryForecast = useGetSubcategoryForecast();
  const getCategoryForecast = useCategoryForecast();

  return ({
    categoryId,
    subcategoryId,
    isSubcategoryRow,
    month,
    year,
    isIncome,
  }: Params): Decimal | undefined => {
    if (!categoryForecasts) {
      return undefined;
    }
    if (categoryId === undefined) {
      return decimalSum(
        ...categoryForecasts
          .filter(
            (f) =>
              f.month === month &&
              f.year === year &&
              f.category.isIncome === isIncome
          )
          .map((f) => f.sum)
      );
    }
    if (!getCategoryById.loaded) {
      return undefined;
    }
    const { fromSavings: isSavingSpending } =
      getCategoryById.getCategoryById(categoryId);
    if (isSavingSpending) {
      return decimalSum(
        ...expenses
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
        return getRestForecastSum({
          categoryId,
          month,
          year,
        });
      } else {
        if (!getSubcategoryForecast.loaded) {
          return undefined;
        }
        return getSubcategoryForecast.getSubcategoryForecast({
          categoryId,
          subcategoryId,
          month,
          year,
        })?.sum;
      }
    }
    if (!getCategoryForecast.loaded) {
      return undefined;
    }
    return getCategoryForecast.getCategoryForecast({
      categoryId,
      month,
      year,
    })?.sum;
  };
};
