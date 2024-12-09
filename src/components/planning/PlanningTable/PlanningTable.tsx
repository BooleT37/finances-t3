import {
  MaterialReactTable,
  MRT_ExpandButton,
  useMaterialReactTable,
  type MRT_ExpandedState,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { NameWithOptionalIcon } from "~/components/categories/categoryIcons/NameWithOptionalIcon";
import { dataStores } from "~/stores/dataStores";
import { PLANNING_SCREEN_SPACE_GAP } from "../PlanningScreen";
import { useHandleCommentChange } from "./useHandleCommentChange";
import { useHandleSumChange } from "./useHandleSumChange";
import usePlanningTableColumns from "./usePlanningTableColumns";

function getRowBgColor(depth: number, hasChildren: boolean) {
  if (!hasChildren) {
    return "transparent";
  }
  if (depth === 0) {
    return "#e0e0e0";
  }
  if (depth === 1) {
    return "#f0f0f0";
  }
  return "transparent";
}

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
  const columns = usePlanningTableColumns({
    saveSum,
    saveComment,
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

  const maxHeight = `calc(100vh - 
    var(--site-content-vertical-margin) * 2
    - var(--site-content-padding) * 2
    - var(--site-header-height)
    - var(--planning-screen-header-height)
    - ${PLANNING_SCREEN_SPACE_GAP}px
  )`;

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
        backgroundColor: getRowBgColor(row.depth, row.getCanExpand()),
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
              <NameWithOptionalIcon
                name={row.original.name}
                icon={row.original.icon}
              />
            </div>
          );
        },
      },
    },
    muiTableContainerProps: { sx: { maxHeight } },
    localization: MRT_Localization_RU,
    enableStickyHeader: true,
  });

  return <MaterialReactTable table={table} />;
});

export default PlanningTable;
