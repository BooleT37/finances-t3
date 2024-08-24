import type { MRT_Cell, MRT_TableInstance } from "material-react-table";
import { action } from "mobx";
import { type SourceTableItem } from "~/models/Source";
import { dataStores } from "~/stores/dataStores";

export const useHandleCreateSource =
  (table: MRT_TableInstance<SourceTableItem>) => async () => {
    const created = await dataStores.sourcesStore.createSource();
    setTimeout(
      action(() => {
        const row = table.getRow(created.id.toString());
        const cell = row
          .getAllCells()
          .find((cell) => cell.column.id === "name");
        if (!cell) {
          console.error("Can't find a cell to edit");
          return;
        }
        table.setEditingCell(
          cell as unknown as MRT_Cell<SourceTableItem, unknown>
        );
      }),
      500
    );
  };
