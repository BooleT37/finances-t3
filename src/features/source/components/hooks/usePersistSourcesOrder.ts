import type { MRT_TableInstance } from "material-react-table";
import { type SourceTableItem } from "~/features/source/Source";
import { usePersistSourcesOrder as usePersistSourcesOrderFromApi } from "~/features/userSettings/api/userSettingsApi";
import { moveItem } from "~/utils/arrays";

function getSourcesOrder(table: MRT_TableInstance<SourceTableItem>): number[] {
  return table.getSortedRowModel().flatRows.map((row) => row.original.id);
}

export const usePersistSourcesOrder = () => {
  const persistSourcesOrderInApi = usePersistSourcesOrderFromApi();
  return (table: MRT_TableInstance<SourceTableItem>) => {
    const { draggingRow, hoveredRow } = table.getState();
    if (!draggingRow || !hoveredRow?.original) {
      return;
    }
    const order = moveItem(
      getSourcesOrder(table),
      draggingRow.original.id,
      hoveredRow.original.id
    );
    persistSourcesOrderInApi.mutate({
      order,
      currentOrder: getSourcesOrder(table),
    });
  };
};
