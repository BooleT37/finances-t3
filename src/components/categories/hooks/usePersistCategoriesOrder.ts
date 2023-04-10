import { type GridApi } from "ag-grid-community";
import { debounce } from "lodash";
import { useMemo } from "react";
import { type CategoryTableItem } from "~/models/Category";
import userSettingsStore from "~/stores/userSettingsStore";

function getCategoriesOrder(api: GridApi<CategoryTableItem>): number[] {
  const order: number[] = [];
  api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data?.id !== undefined) {
      order.push(node.data?.id);
    }
  });
  return order;
}

export const usePersistCategoriesOrder = () => {
  const persistFn = (isIncome: boolean, api: GridApi<CategoryTableItem>) => {
    const order = getCategoriesOrder(api);
    if (isIncome) {
      void userSettingsStore.persistIncomeCategoryOrder(order);
    } else {
      void userSettingsStore.persistExpenseCategoryOrder(order);
    }
  };
  const debouncedPersist = useMemo(() => debounce(persistFn, 500), []);

  return debouncedPersist;
};
