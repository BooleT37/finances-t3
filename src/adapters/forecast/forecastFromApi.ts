import type { Forecast as ApiForecast } from "@prisma/client";
import Forecast from "~/models/Forecast";
import categories from "~/readonlyStores/categories";

export function adaptForecastFromApi(forecast: ApiForecast): Forecast {
  return new Forecast(
    categories.getById(forecast.categoryId),
    forecast.month,
    forecast.year,
    forecast.sum,
    forecast.comment
  );
}
