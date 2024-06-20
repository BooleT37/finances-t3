import type { Row } from "@tanstack/react-table";
import Decimal from "decimal.js";
import { action } from "mobx";
import { type TableData } from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import { type AggCostCol } from "~/types/data";

export default action(function costAggregationFn(
  rows: Row<TableData>[],
  categoriesForecast: Record<number, Decimal> | null,
  savingSpendingsForecast: Decimal
): AggCostCol {
  const categoryId = rows[0]?.original.categoryId;
  if (rows.length === 0 || categoryId === undefined) {
    return {
      value: new Decimal(0),
      diff: null,
      isIncome: false,
      isContinuous: false,
    };
  }
  const value = rows.reduce(
    (a, c) =>
      c.original.isUpcomingSubscription
        ? a
        : a.add(c.original.cost?.value ?? 0),
    new Decimal(0)
  );
  const {
    isIncome,
    isContinuous,
    fromSavings: isSavingSpending,
  } = dataStores.categoriesStore.getById(categoryId);
  const forecast = isSavingSpending
    ? savingSpendingsForecast
    : categoriesForecast?.[categoryId];
  const diff = forecast !== undefined ? forecast.minus(value) : value.neg();
  // TODO count diff differently for saving spendings

  return {
    value,
    diff,
    isIncome,
    isContinuous,
  };
});
