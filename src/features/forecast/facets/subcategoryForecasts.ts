import { useMemo } from "react";
import { useAllForecasts } from "./allForecasts";

export const useSubcategoryForecasts = () => {
  const { data: forecasts } = useAllForecasts();
  return useMemo(
    () => forecasts?.filter((f) => f.subcategoryId !== null),
    [forecasts]
  );
};
