import {
  MaterialReactTable,
  MRT_ExpandButton,
  useMaterialReactTable,
  type MRT_ExpandedState,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { observer } from "mobx-react";
import React, { useCallback, useMemo } from "react";
import { dataStores } from "~/stores/dataStores";
import { useHandleCommentChange } from "./useHandleCommentChange";
import { useHandleSumChange } from "./useHandleSumChange";
import usePlanningTableColumns from "./usePlanningTableColumns";

interface Props {
  month: number;
  year: number;
}

const PlanningTable: React.FC<Props> = observer(function PlanningTable({
  month,
  year,
}) {
  const saveSum = useHandleSumChange({ month, year });
  const saveComment = useHandleCommentChange({ month, year });
  const transferPersonalExpense = useCallback(
    async (categoryId: number) => {
      await dataStores.forecastStore.transferPersonalExpense(
        categoryId,
        month,
        year
      );
    },
    [month, year]
  );
  const columns = usePlanningTableColumns({
    saveSum,
    saveComment,
    transferPersonalExpense,
  });
  const data = dataStores.forecastStore.tableData({
    month,
    year,
  });

  // expanding all top level rows
  const initialExpandedRootRows = useMemo<MRT_ExpandedState>(
    () =>
      data
        .map((originalRow) => originalRow.tableId)
        .reduce((a, v) => ({ ...a, [v]: true }), {}),
    [data]
  );

  const table = useMaterialReactTable({
    enableExpandAll: true,
    enableExpanding: true,
    editDisplayMode: "cell",
    columns,
    data,
    getRowId: (row) => row.tableId,
    enableEditing: true,
    enableGrouping: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnDragging: false,
    enablePagination: false,
    groupedColumnMode: "remove",
    enableColumnActions: false,
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.depth === 0 ? "#efefef" : undefined,
      },
    }),
    initialState: {
      expanded: initialExpandedRootRows,
      density: "compact",
    },
    displayColumnDefOptions: {
      "mrt-row-expand": {
        Header: "Категория",
        size: 200,
        Cell: ({ row, table }) => {
          return (
            <div style={{ lineHeight: "40px" }}>
              <MRT_ExpandButton row={row} table={table} />
              {row.original.name}
            </div>
          );
        },
      },
    },
    localization: MRT_Localization_RU,
  });

  return <MaterialReactTable table={table} />;
});

export default PlanningTable;
