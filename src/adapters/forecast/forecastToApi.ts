import { type Prisma } from "@prisma/client";
import type Forecast from "~/models/Forecast";

export function adaptForecastToCreateInput(
  forecast: Forecast
): Prisma.ForecastCreateInput {
  return {
    category: {
      connect: {
        id: forecast.category.id,
      },
    },
    month: forecast.month,
    year: forecast.year,
    comment: forecast.comment,
    sum: forecast.sum,
  };
}
