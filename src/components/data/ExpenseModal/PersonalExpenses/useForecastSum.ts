import { type Dayjs } from "dayjs";
import sum from "lodash/sum";
import { action } from "mobx";
import { dataStores } from "~/stores/dataStores";

export const useForecastSum = action(
  (date: Dayjs | undefined, categoryId: number | undefined) => {
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
    const spent = sum(
      (dataStores.expenseStore.expensesByCategoryId[categoryId] ?? [])
        .filter((expense) => expense.date.isSame(date, "month"))
        .map((expense) => expense.cost ?? 0)
    );

    return forecast - spent;
  }
);
