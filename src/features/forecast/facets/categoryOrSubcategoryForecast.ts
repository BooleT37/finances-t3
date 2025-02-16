import { useCallback } from "react";
import type Forecast from "../Forecast";
import { useAllForecasts } from "./allForecasts";

export const useGetCategoryOrSubcategoryForecast = () => {
  const { data: forecasts } = useAllForecasts();

  return useCallback(
    ({
      categoryId,
      subcategoryId,
      month,
      year,
    }: {
      categoryId: number;
      subcategoryId: number | null;
      month: number;
      year: number;
    }) => {
      if (!forecasts) return undefined;

      return forecasts.find(
        (f: Forecast) =>
          f.category.id === categoryId &&
          (f.subcategory?.id ?? null) === subcategoryId &&
          f.month === month &&
          f.year === year
      );
    },
    [forecasts]
  );
};
