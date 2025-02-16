import { useCallback } from "react";
import type Forecast from "../Forecast";
import { useSubcategoryForecasts } from "./subcategoryForecasts";

export const useGetSubcategoryForecast = () => {
  const subcategoryForecasts = useSubcategoryForecasts();

  const getSubcategoryForecast = useCallback(
    ({
      categoryId,
      subcategoryId,
      month,
      year,
    }: {
      categoryId: number;
      subcategoryId: number;
      month: number;
      year: number;
    }) =>
      subcategoryForecasts?.find(
        (f: Forecast) =>
          f.category.id === categoryId &&
          f.subcategoryId === subcategoryId &&
          f.month === month &&
          f.year === year
      ),
    [subcategoryForecasts]
  );
  if (!subcategoryForecasts) {
    return { loaded: false as const };
  }
  return { loaded: true as const, getSubcategoryForecast };
};
