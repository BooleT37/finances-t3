import { useQueryClient } from "@tanstack/react-query";
import type { Decimal } from "decimal.js";
import { useCallback } from "react";
import { forecastKeys, useUpsertForecast } from "../api/forecastApi";
import type { ApiForecast } from "../api/types";

export const useChangeForecastSum = () => {
  const upsertForecast = useUpsertForecast();
  const queryClient = useQueryClient();

  return useCallback(
    async (
      categoryId: number,
      subcategoryId: number | null,
      month: number,
      year: number,
      sum: Decimal
    ) => {
      const newForecast = await upsertForecast.mutateAsync({
        categoryId,
        subcategoryId,
        month,
        year,
        sum,
      });

      queryClient.setQueryData<ApiForecast[]>(
        forecastKeys.all,
        (oldData): ApiForecast[] | undefined => {
          if (!oldData) return undefined;

          const forecastIndex = oldData.findIndex(
            (f) =>
              f.categoryId === categoryId &&
              f.subcategoryId === subcategoryId &&
              f.month === month &&
              f.year === year
          );
          const forecast = oldData[forecastIndex];

          if (forecast) {
            return [
              ...oldData.slice(0, forecastIndex),
              newForecast,
              ...oldData.slice(forecastIndex + 1),
            ];
          }

          return [...oldData, newForecast];
        }
      );
    },
    [upsertForecast, queryClient]
  );
};
