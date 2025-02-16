import { useMutation } from "@tanstack/react-query";
import type { Decimal } from "decimal.js";
import type Category from "~/features/category/Category";
import type Subcategory from "~/features/category/Subcategory";
import { adaptCostFromApi } from "~/features/shared/adapters/adaptCostFromApi";
import { trpc } from "~/utils/api";
import Forecast from "../Forecast";
import type { ApiForecast } from "./types";

export const forecastKeys = {
  all: ["forecasts"] as const,
};

export const forecastQueryParams = {
  queryKey: forecastKeys.all,
  queryFn: () => trpc.forecast.getAll.query(),
} as const;

export function adaptForecastFromApi(
  forecast: ApiForecast,
  category: Category,
  subcategory: Subcategory | null
): Forecast {
  return new Forecast(
    category,
    subcategory,
    forecast.month,
    forecast.year,
    adaptCostFromApi(forecast.sum, category),
    forecast.comment
  );
}

export const useUpsertForecast = () =>
  useMutation({
    mutationFn: async ({
      categoryId,
      subcategoryId,
      month,
      year,
      sum,
      comment,
    }: {
      categoryId: number;
      subcategoryId: number | null;
      month: number;
      year: number;
      sum?: Decimal;
      comment?: string;
    }) =>
      trpc.forecast.upsert.mutate({
        categoryId,
        subcategoryId,
        month,
        year,
        sum: sum ? sum.abs() : undefined,
        comment,
      }),
  });
