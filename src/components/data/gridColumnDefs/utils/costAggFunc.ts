import type { IRowNode } from "ag-grid-enterprise";
import { action } from "mobx";
import { type CostCol, type TableData } from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import { type AggCostCol } from "~/types/data";
import roundCost from "~/utils/roundCost";

export default action(function costAggFunc(
  values: CostCol[],
  rowNode: IRowNode<TableData>,
  categoriesForecast: Record<number, number> | null,
  savingSpendingsForecast: number
): AggCostCol {
  if (values.length === 0 || !rowNode.allLeafChildren?.[0]?.data) {
    return {
      value: 0,
      diff: null,
      isIncome: false,
      isContinuous: false,
    };
  }
  const value = roundCost(
    values.reduce((a, c) => (c.isUpcomingSubscription ? a : a + c.value), 0)
  );
  const { categoryId } = rowNode.allLeafChildren[0].data;
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
