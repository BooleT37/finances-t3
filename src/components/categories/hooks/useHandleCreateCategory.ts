import { type AgGridReact } from "ag-grid-react";
import { type RefObject } from "react";
import { type CategoryTableItem } from "~/models/Category";
import { dataStores } from "~/stores/dataStores";

export const useHandleCreateCategory =
  () =>
  async (isIncome: boolean, ref: RefObject<AgGridReact<CategoryTableItem>>) => {
    const created = await dataStores.categoriesStore.createCategory(isIncome);
    if (!ref.current) {
      return;
    }
    const api = ref.current.api;
    setTimeout(() => {
      const node = api.getRowNode(created.id.toString());
      if (!node || node.rowIndex === null) {
        console.error("Can't find a row to edit");
        return;
      }
      api.flashCells({ rowNodes: [node] });
      api.startEditingCell({
        colKey: "name",
        rowIndex: node.rowIndex,
      });
    }, 500);
  };
