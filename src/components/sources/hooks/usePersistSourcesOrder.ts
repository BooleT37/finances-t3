import type { MRT_TableInstance } from "material-react-table";
import { runInAction } from "mobx";
import type { SourceTableItem } from "~/models/Source";
import { dataStores } from "~/stores/dataStores";
import { moveItem } from "../../../utils/arrays";

function getSourcesOrder(table: MRT_TableInstance<SourceTableItem>): number[] {
  return table.getSortedRowModel().flatRows.map((row) => row.original.id);
}

export const usePersistSourcesOrder = () => {
  return (table: MRT_TableInstance<SourceTableItem>) =>
    runInAction(() => {
      const { draggingRow, hoveredRow } = table.getState();
      if (!draggingRow || !hoveredRow?.original) {
        return;
      }
      const order = moveItem(
        getSourcesOrder(table),
        draggingRow.original.id,
        hoveredRow.original.id
      );
      void dataStores.userSettingsStore.persistSourcesOrder(order);
    });
};
