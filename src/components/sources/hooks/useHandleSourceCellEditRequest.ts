import { type CellEditRequestEvent } from "ag-grid-community";
import { type SourceTableItem } from "~/models/Source";
import sourcesStore from "~/stores/sourcesStore";

export const useHandleSourceCellEditRequest =
  () => (event: CellEditRequestEvent<SourceTableItem>) => {
    if (event.colDef.field !== "name") {
      throw new Error("Only name editing is supported for source");
    }
    if (event.newValue !== event.oldValue) {
      void sourcesStore.editSourceName(event.newValue as string, event.data.id);
    }
  };
