import Decimal from "decimal.js";
import type { MRT_Row } from "material-react-table";
import { runInAction } from "mobx";
import { useCallback } from "react";
import { dataStores } from "~/stores/dataStores";
import { REST_SUBCATEGORY_ID } from "~/stores/ForecastStore";
import type { ForecastTableItem } from "~/stores/ForecastStore/types";
import { decimalSum } from "~/utils/decimalSum";

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
  return useCallback(
    async (
      categoryId: number,
      subcategoryId: number | null,
      sum: Decimal,
      row: MRT_Row<ForecastTableItem>
    ) => {
      if (subcategoryId === null) {
        await dataStores.forecastStore.changeForecastSum(
          dataStores.categoriesStore.getById(categoryId),
          null,
          month,
          year,
          sum
        );
        return;
      }

      await runInAction(async () => {
        // сначала обновляем сумму родительской категории
        const existingForecast =
          dataStores.forecastStore.getSubcategoryForecast({
            categoryId,
            subcategoryId,
            month,
            year,
          });
        const existingParentForecast =
          dataStores.forecastStore.getCategoryForecast({
            categoryId,
            month,
            year,
          });
        const hasSiblings =
          dataStores.forecastStore.subcategoriesForecasts.some(
            (f) =>
              f.category.id === categoryId &&
              f.year === year &&
              f.month === month &&
              f.subcategoryId !== subcategoryId
          );

        const isFirstSubcategoryInExistingParent =
          !existingForecast && existingParentForecast && !hasSiblings;

        // если это первая заполненная подкатегория, то мы не перезаписываем
        // родительскую сумму, а вместо этого остаток попадает в категорию "остаток"
        if (!isFirstSubcategoryInExistingParent) {
          const siblingsSum = getSiblingsSum(row);
          void dataStores.forecastStore.changeForecastSum(
            dataStores.categoriesStore.getById(categoryId),
            null,
            month,
            year,
            siblingsSum.plus(sum)
          );
        }

        // наконец обновляем сумму самой подкатегории
        if (subcategoryId !== REST_SUBCATEGORY_ID) {
          await dataStores.forecastStore.changeForecastSum(
            dataStores.categoriesStore.getById(categoryId),
            dataStores.categoriesStore.getSubcategoryById(
              categoryId,
              subcategoryId
            ),
            month,
            year,
            sum
          );
        }
      });
    },
    [month, year]
  );
};
