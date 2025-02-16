import { useCallback } from "react";
import { useAllForecasts } from "./allForecasts";

export const useGetForecastsForMonth = () => {
  const { data: forecasts } = useAllForecasts();
  return useCallback(
    (year: number, month: number) =>
      forecasts?.filter((f) => f.year === year && f.month === month) ?? [],
    [forecasts]
  );
};
