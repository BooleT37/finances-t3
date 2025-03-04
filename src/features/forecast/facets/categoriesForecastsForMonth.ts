import { useCallback } from "react";
import { useAllForecasts } from "./allForecasts";

export const useGetCategoriesForecastsForMonth = () => {
  const { data: forecasts } = useAllForecasts();
  return useCallback(
    (year: number, month: number) =>
      forecasts?.filter(
        (f) => f.subcategoryId === null && f.year === year && f.month === month
      ) ?? [],
    [forecasts]
  );
};
