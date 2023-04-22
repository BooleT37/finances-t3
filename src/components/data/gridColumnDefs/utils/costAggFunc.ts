import { type IAggFuncParams } from "ag-grid-enterprise";
import { action } from "mobx";
import { type CostCol, type TableData } from "~/models/Expense";
import categoriesStore from "~/stores/categoriesStore";
import { type AggCostCol } from "~/types/data";
import roundCost from "~/utils/roundCost";
import { type DataTableContext } from "../../DataScreen";

export default action(function costAggFunc(
  params: IAggFuncParams<TableData, CostCol>
): AggCostCol {
  const values = params.values;
  if (values.length === 0 || !params.rowNode.allLeafChildren?.[0]?.data) {
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
  const { categoryId } = params.rowNode.allLeafChildren[0].data;
  const {
    isIncome,
    isContinuous,
    fromSavings: isSavingSpending,
  } = categoriesStore.getById(categoryId);
  const context = params.context as DataTableContext;
  const forecast = isSavingSpending
    ? context.savingSpendingsForecast
    : context.categoriesForecast?.[categoryId];
  const diff = forecast !== undefined ? roundCost(forecast - value) : -value;
  // TODO count diff differently for saving spendings

  return {
    value,
    diff,
    isIncome,
    isContinuous,
  };
});
