import Decimal from "decimal.js";
import { decimalSum } from "~/utils/decimalSum";
import { useCategoryForecast } from "./categoryForecast";
import { useSubcategoryForecasts } from "./subcategoryForecasts";

/**
 * Returns the remaining forecast sum for a category after subtracting all subcategory forecasts.
 * This is useful for calculating the "rest" amount that's not allocated to specific subcategories.
 */
export const useGetRestForecastSum = () => {
  const categoryForecastData = useCategoryForecast();
  const subcategoryForecasts = useSubcategoryForecasts();

  return ({
    categoryId,
    month,
    year,
  }: {
    categoryId: number;
    month: number;
    year: number;
  }): Decimal => {
    if (!categoryForecastData.loaded) {
      return new Decimal(0);
    }
    const categoryForecast = categoryForecastData.getCategoryForecast({
      categoryId,
      month,
      year,
    });
    if (!categoryForecast) {
      return new Decimal(0);
    }

    const subcategoriesSum = subcategoryForecasts
      ? decimalSum(
          ...subcategoryForecasts
            .filter(
              (f) =>
                f.category.id === categoryId &&
                f.month === month &&
                f.year === year
            )
            .map((f) => f.sum)
        )
      : new Decimal(0);

    return categoryForecast.sum.minus(subcategoriesSum);
  };
};
