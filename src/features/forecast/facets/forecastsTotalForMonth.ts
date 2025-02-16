import Decimal from "decimal.js";
import { useCallback } from "react";
import { useGetForecastsForMonth } from "./forecastsForMonth";

export const useGetForecastsTotalForMonth = () => {
  const getForecastsForMonth = useGetForecastsForMonth();
  return useCallback(
    (year: number, month: number) =>
      getForecastsForMonth(year, month)
        .filter((f) => !f.category.fromSavings)
        .reduce((sum, f) => sum.plus(f.sum), new Decimal(0)),
    [getForecastsForMonth]
  );
};
