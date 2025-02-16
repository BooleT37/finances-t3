import type { MRT_TableInstance } from "material-react-table";
import type { CategoryTableItem } from "~/features/category/Category";
import {
  usePersistExpenseCategoryOrder,
  usePersistIncomeCategoryOrder,
} from "~/features/userSettings/api/userSettingsApi";
import { moveItem } from "~/utils/arrays";

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
  const persistIncomeCategoryOrder = usePersistIncomeCategoryOrder();
  const persistExpenseCategoryOrder = usePersistExpenseCategoryOrder();
  return (table: MRT_TableInstance<CategoryTableItem>, isIncome: boolean) => {
    const { draggingRow, hoveredRow } = table.getState();
    if (!draggingRow || !hoveredRow?.original) {
      return;
    }
    const order = moveItem(
      getCategoriesOrder(table, isIncome),
      draggingRow.original.id,
      hoveredRow.original.id
    );
    if (isIncome) {
      void persistIncomeCategoryOrder.mutate(order);
    } else {
      void persistExpenseCategoryOrder.mutate(order);
    }
  };
};
