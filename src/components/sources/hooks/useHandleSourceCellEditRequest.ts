import { type CellEditRequestEvent } from "ag-grid-community";
import { type SourceTableItem } from "~/models/Source";
import { dataStores } from "~/stores/dataStores";

export const useHandleSourceCellEditRequest =
  () => (event: CellEditRequestEvent<SourceTableItem>) => {
    if (event.colDef.field !== "name") {
      throw new Error("Only name editing is supported for source");
    }
    if (event.newValue !== event.oldValue) {
      void dataStores.sourcesStore.editSourceName(
        event.newValue as string,
        event.data.id
      );
    }
  };
