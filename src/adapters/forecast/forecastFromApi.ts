import type { Forecast as ApiForecast } from "@prisma/client";
import Forecast from "~/models/Forecast";
import { dataStores } from "~/stores/dataStores";

export function adaptForecastFromApi(forecast: ApiForecast): Forecast {
  return new Forecast(
    dataStores.categoriesStore.getById(forecast.categoryId),
    forecast.month,
    forecast.year,
    forecast.sum,
    forecast.comment
  );
}
