import { type Dayjs } from "dayjs";
import sum from "lodash/sum";
import { action } from "mobx";
import categoriesStore from "~/stores/categoriesStore";
import expenseStore from "~/stores/expenseStore";
import forecastStore from "~/stores/forecastStore";

export const useForecastSum = action(
  (date: Dayjs | undefined, categoryId: number | undefined) => {
    if (categoryId === undefined) {
      return undefined;
    }
    const forecast =
      date && categoryId !== undefined
        ? forecastStore.find(
            date.year(),
            date.month(),
            categoriesStore.getById(categoryId)
          )?.sum
        : undefined;
    if (forecast === undefined) {
      return undefined;
    }
    const spent = sum(
      (expenseStore.expensesByCategoryId[categoryId] ?? [])
        .filter((expense) => expense.date.isSame(date, "month"))
        .map((expense) => expense.cost ?? 0)
    );

    return forecast - spent;
  }
);
