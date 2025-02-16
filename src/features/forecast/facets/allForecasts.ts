import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useCategories } from "~/features/category/facets/allCategories";
import { adaptForecastFromApi, forecastQueryParams } from "../api/forecastApi";

export const useAllForecasts = () => {
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();

  const query = useQuery(
    {
      ...forecastQueryParams,
      select: (data) => {
        if (!categories) {
          return null;
        }
        return data.map((forecast) => {
          const category = categories.find((c) => c.id === forecast.categoryId);
          if (!category) {
            throw new Error(
              `Can't load forecasts. Can't find category with id ${forecast.categoryId}`
            );
          }

          const subcategory =
            forecast.subcategoryId === null
              ? null
              : category.subcategories.find(
                  (s) => s.id === forecast.subcategoryId
                );
          if (subcategory === undefined) {
            throw new Error(
              `Can't load forecasts. Can't find subcategory with id ${forecast.subcategoryId}`
            );
          }

          return adaptForecastFromApi(forecast, category, subcategory);
        });
      },
    },
    queryClient
  );

  return useMemo(() => query, [query]);
};
