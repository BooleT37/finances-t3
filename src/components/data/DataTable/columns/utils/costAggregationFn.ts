import type { Row } from "@tanstack/react-table";
import { action } from "mobx";
import { type TableData } from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import { type AggCostCol } from "~/types/data";
import roundCost from "~/utils/roundCost";

export default action(function costAggregationFn(
  rows: Row<TableData>[],
  categoriesForecast: Record<number, number> | null,
  savingSpendingsForecast: number
): AggCostCol {
  const categoryId = rows[0]?.original.categoryId;
  if (rows.length === 0 || categoryId === undefined) {
    return {
      value: 0,
      diff: null,
      isIncome: false,
      isContinuous: false,
    };
  }
  const value = roundCost(
    rows.reduce(
      (a, c) =>
        c.original.isUpcomingSubscription
          ? a
          : a + (c.original.cost?.value ?? 0),
      0
    )
  );
  const {
    isIncome,
    isContinuous,
    fromSavings: isSavingSpending,
  } = dataStores.categoriesStore.getById(categoryId);
  const forecast = isSavingSpending
    ? savingSpendingsForecast
    : categoriesForecast?.[categoryId];
  const diff = forecast !== undefined ? roundCost(forecast - value) : -value;
  // TODO count diff differently for saving spendings

  return {
    value,
    diff,
    isIncome,
    isContinuous,
  };
});
