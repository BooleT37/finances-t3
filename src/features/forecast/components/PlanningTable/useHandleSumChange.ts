import Decimal from "decimal.js";
import type { MRT_Row } from "material-react-table";
import { useCallback } from "react";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useGetCategoryOrSubcategoryForecast } from "~/features/forecast/facets/categoryOrSubcategoryForecast";
import { useChangeForecastSum } from "~/features/forecast/facets/changeForecastSum";
import { REST_SUBCATEGORY_ID } from "~/features/forecast/facets/forecastConstants";
import type { ForecastTableItem } from "~/features/forecast/types";
import { decimalSum } from "~/utils/decimalSum";
import { useSubcategoryForecasts } from "../../facets/subcategoryForecasts";

function getSiblingsSum(row: MRT_Row<ForecastTableItem>) {
  const parentRow = row.getParentRow();
  const subRows = parentRow?.original?.subRows;
  if (!subRows) {
    return new Decimal(0);
  }
  return decimalSum(
    ...subRows
      .filter((sibling) => sibling.tableId !== row.original.tableId)
      .map((sibling) => sibling.sum ?? new Decimal(0))
  );
}

export const useHandleSumChange = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const getCategoryById = useGetCategoryById();
  const changeForecastSum = useChangeForecastSum();
  const getCategoryOrSubcategoryForecast =
    useGetCategoryOrSubcategoryForecast();
  const subcategoriesForecasts = useSubcategoryForecasts();

  return useCallback(
    async (
      categoryId: number,
      subcategoryId: number | null,
      sum: Decimal,
      row: MRT_Row<ForecastTableItem>
    ) => {
      if (!getCategoryById.loaded) {
        console.error("Cannot change forecast sum: categoies not loaded");
        return;
      }
      const category = getCategoryById.getCategoryById(categoryId);
      const sumWithCorrectSign =
        category.isIncome || sum.eq(0) ? sum : sum.abs().negated();

      if (subcategoryId === null) {
        await changeForecastSum(
          categoryId,
          null,
          month,
          year,
          sumWithCorrectSign
        );
        return;
      }

      // Check if this is the first subcategory being added to an existing parent forecast
      const existingForecast = getCategoryOrSubcategoryForecast({
        categoryId,
        subcategoryId,
        month,
        year,
      });
      const existingParentForecast = getCategoryOrSubcategoryForecast({
        categoryId,
        subcategoryId: null,
        month,
        year,
      });

      const hasSiblings =
        subcategoriesForecasts?.some(
          (f) =>
            f.category.id === categoryId &&
            f.year === year &&
            f.month === month &&
            f.subcategoryId !== subcategoryId
        ) ?? false;

      const isFirstSubcategoryInExistingParent =
        !existingForecast && existingParentForecast && !hasSiblings;

      // If this is the first subcategory in an existing parent forecast,
      // we don't update parent sum
      // Instead, the rest goes to "other" category
      if (!isFirstSubcategoryInExistingParent) {
        const siblingsSum = getSiblingsSum(row);
        await changeForecastSum(
          categoryId,
          null,
          month,
          year,
          siblingsSum.plus(sumWithCorrectSign)
        );
      }

      // Finally update the subcategory sum
      if (subcategoryId !== REST_SUBCATEGORY_ID) {
        await changeForecastSum(
          categoryId,
          subcategoryId,
          month,
          year,
          sumWithCorrectSign
        );
      }
    },
    [
      getCategoryById,
      getCategoryOrSubcategoryForecast,
      month,
      year,
      subcategoriesForecasts,
      changeForecastSum,
    ]
  );
};
