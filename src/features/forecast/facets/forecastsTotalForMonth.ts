import Decimal from "decimal.js";
import { useCallback } from "react";
import { useGetCategoriesForecastsForMonth } from "./categoriesForecastsForMonth";

export const useGetForecastsTotalForMonth = () => {
  const getForecastsForMonth = useGetCategoriesForecastsForMonth();
  return useCallback(
    (year: number, month: number) =>
      getForecastsForMonth(year, month)
        .filter((f) => !f.category.fromSavings)
        .reduce((sum, f) => sum.plus(f.sum), new Decimal(0)),
    [getForecastsForMonth]
  );
};
