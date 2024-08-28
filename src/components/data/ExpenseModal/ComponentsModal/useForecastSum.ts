import { type Dayjs } from "dayjs";
import Decimal from "decimal.js";
import { action } from "mobx";
import { dataStores } from "~/stores/dataStores";
import { decimalSum } from "~/utils/decimalSum";

export const useGetForecastSum = (date: Dayjs | undefined) => {
  return action((categoryId: number | undefined) => {
    if (categoryId === undefined) {
      return undefined;
    }
    const forecast =
      date && categoryId !== undefined
        ? dataStores.forecastStore.find(
            date.year(),
            date.month(),
            dataStores.categoriesStore.getById(categoryId)
          )?.sum
        : undefined;
    if (forecast === undefined) {
      return undefined;
    }
    const spent = decimalSum(
      ...(dataStores.expenseStore.expensesByCategoryId[categoryId] ?? [])
        .filter((expense) => expense.date.isSame(date, "month"))
        .map((expense) => expense.cost ?? new Decimal(0))
    );

    return forecast.minus(spent);
  });
};
