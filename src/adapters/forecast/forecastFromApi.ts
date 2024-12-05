import type { Forecast as ApiForecast } from "@prisma/client";
import Forecast from "~/models/Forecast";
import { dataStores } from "~/stores/dataStores";

export function adaptForecastFromApi(forecast: ApiForecast): Forecast {
  const category = dataStores.categoriesStore.getById(forecast.categoryId);
  return new Forecast(
    category,
    forecast.subcategoryId === null
      ? null
      : dataStores.categoriesStore.getSubcategoryById(
          forecast.categoryId,
          forecast.subcategoryId
        ),
    forecast.month,
    forecast.year,
    category.isIncome ? forecast.sum : forecast.sum.negated(),
    forecast.comment
  );
}
