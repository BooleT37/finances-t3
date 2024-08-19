import type { MRT_TableInstance } from "material-react-table";
import { runInAction } from "mobx";
import { type CategoryTableItem } from "~/models/Category";
import { dataStores } from "~/stores/dataStores";

function moveItem<T>(array: T[], item: T, moveAfter: T): T[] {
  const fromIndex = array.indexOf(item);
  const toIndex = array.indexOf(moveAfter);
  if (fromIndex === -1 || toIndex === -1) {
    return array;
  }
  const result = [...array];
  result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
}

function getCategoriesOrder(
  table: MRT_TableInstance<CategoryTableItem>,
  isIncome: boolean
): number[] {
  return table
    .getSortedRowModel()
    .flatRows.filter(
      (row) => !row.getIsGrouped() && row.original.isIncome === isIncome
    )
    .map((row) => row.original.id);
}

export const usePersistCategoriesOrder = () => {
  return (table: MRT_TableInstance<CategoryTableItem>, isIncome: boolean) =>
    runInAction(() => {
      const { draggingRow, hoveredRow } = table.getState();
      if (!draggingRow || !hoveredRow || !hoveredRow.original) {
        return;
      }
      const order = moveItem(
        getCategoriesOrder(table, isIncome),
        draggingRow.original.id,
        hoveredRow.original.id
      );
      if (isIncome) {
        void dataStores.userSettingsStore.persistIncomeCategoryOrder(order);
      } else {
        void dataStores.userSettingsStore.persistExpenseCategoryOrder(order);
      }
    });
};
