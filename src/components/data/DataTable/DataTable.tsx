import { type TableRowProps } from "@mui/material";
import { Space } from "antd";
import type Decimal from "decimal.js";
import {
  MaterialReactTable,
  MRT_ExpandAllButton,
  MRT_ExpandButton,
  useMaterialReactTable,
  type MRT_Row,
  type MRT_TableInstance,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { action } from "mobx";
import React, { useEffect } from "react";
import { type TableData } from "~/models/Expense";
import { sortAllCategoriesByName } from "~/stores/categoriesOrder";
import { dataStores } from "~/stores/dataStores";
import { useDataTableColumns } from "./columns/useDataTableColumns";
import { RowActions } from "./RowActions";

interface Props {
  data: TableData[];
  categoriesForecast: Record<number, Decimal> | null;
  savingSpendingsForecast: Decimal;
  passedDaysRatio: number;
  groupBySubcategories: boolean;
  tableInstanceRef: React.MutableRefObject<MRT_TableInstance<TableData> | null>;
}

// eslint-disable-next-line mobx/missing-observer
export const DataTable: React.FC<Props> = ({
  data,
  categoriesForecast,
  passedDaysRatio,
  savingSpendingsForecast,
  groupBySubcategories,
  tableInstanceRef,
}) => {
  const columns = useDataTableColumns({
    categoriesForecast,
    savingSpendingsForecast,
    passedDaysRatio,
  });
  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnDragging: false,
    enablePagination: false,
    groupedColumnMode: "remove",
    enableColumnActions: false,
    initialState: {
      grouping: ["category"],
      expanded: true,
      sorting: [{ id: "category", desc: false }],
      density: "compact",
      columnVisibility: { subcategory: false },
    },
    enableRowActions: true,
    renderRowActions: ({ row }) => {
      if (row.original.isUpcomingSubscription) {
        return undefined;
      }
      return (
        <RowActions
          id={row.original.id}
          parentExpenseId={row.original.expenseId}
        />
      );
    },
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-expand": {
        Header: () => (
          <Space align="center">
            <MRT_ExpandAllButton table={table} />
            <div>Расход</div>
          </Space>
        ),
        Cell: ({ row, table }) => {
          return (
            <>
              <MRT_ExpandButton row={row} table={table} />
              {row.getIsGrouped()
                ? row.depth === 0
                  ? row.original.category
                  : row.original.subcategory ?? "<без подкатегории>"
                : row.original.name}
            </>
          );
        },
        GroupedCell: ({ row }) => row.original.name,
        size: 200,
      },
    },
    sortingFns: {
      sortCategories: (rowA, rowB) => {
        return rowA.getIsGrouped() && rowB.getIsGrouped()
          ? sortAllCategoriesByName(
              (rowA.getGroupingValue("category") as string) ?? "",
              (rowB.getGroupingValue("category") as string) ?? ""
            )
          : 0;
      },
    },
    localization: MRT_Localization_RU,
    muiTableBodyRowProps: action(
      ({ row }: { row: MRT_Row<TableData> }): TableRowProps => ({
        sx: {
          fontStyle:
            row.getIsGrouped() &&
            dataStores.categoriesStore.incomeCategoriesNames.includes(
              row.getGroupingValue("category") as string
            )
              ? "italic"
              : undefined,
        },
      })
    ),
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        color: row.original.isUpcomingSubscription ? "darkgray" : undefined,
      },
    }),
  });

  // const expandCategory = React.useCallback((category: string) => {
  //   setTimeout(() => {
  //     if (!gridRef.current) {
  //       return;
  //     }
  //     gridRef.current.api.forEachNode((node) => {
  //       if (node.key === category) {
  //         node.setExpanded(true);
  //       }
  //     });
  //   }, 0);
  // }, []);

  useEffect(() => {
    tableInstanceRef.current = table;
  }, [table, tableInstanceRef]);

  useEffect(() => {
    if (groupBySubcategories) {
      table.setGrouping(["category", "subcategory"]);
    } else {
      table.setGrouping(["category"]);
    }
  }, [groupBySubcategories, table]);

  return <MaterialReactTable table={table} />;
};
