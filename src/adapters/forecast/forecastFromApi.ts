import type { Forecast as ApiForecast } from "@prisma/client";
import Forecast from "~/models/Forecast";
import categoriesStore from "~/stores/categoriesStore";

export function adaptForecastFromApi(forecast: ApiForecast): Forecast {
  return new Forecast(
    categoriesStore.getById(forecast.categoryId),
    forecast.month,
    forecast.year,
    forecast.sum,
    forecast.comment
  );
}
