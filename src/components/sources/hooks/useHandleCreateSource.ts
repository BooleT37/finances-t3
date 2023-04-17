import { type AgGridReact } from "ag-grid-react";
import { type RefObject } from "react";
import { type SourceTableItem } from "~/models/Source";
import sourcesStore from "~/stores/sourcesStore";

export const useHandleCreateSource =
  () => async (ref: RefObject<AgGridReact<SourceTableItem>>) => {
    const created = await sourcesStore.createSource();
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
