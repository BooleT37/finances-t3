import { useCallback } from "react";
import type Forecast from "../Forecast";
import { useCategoryForecasts } from "./categoryForecasts";

export const useCategoryForecast = () => {
  const categoryForecasts = useCategoryForecasts();

  const getCategoryForecast = useCallback(
    ({
      categoryId,
      month,
      year,
    }: {
      categoryId: number;
      month: number;
      year: number;
    }) =>
      categoryForecasts?.find(
        (f: Forecast) =>
          f.category.id === categoryId && f.month === month && f.year === year
      ),
    [categoryForecasts]
  );
  if (!categoryForecasts) {
    return { loaded: false as const };
  }
  return { loaded: true as const, getCategoryForecast };
};
