import { Space } from "antd";
import {
  MaterialReactTable,
  MRT_ExpandAllButton,
  MRT_ExpandButton,
  useMaterialReactTable,
  type MRT_TableInstance,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import React, { useEffect } from "react";
import { NameWithOptionalIcon } from "~/components/categories/categoryIcons/NameWithOptionalIcon";
import { type TableData } from "~/models/Expense";
import {
  sortAllCategoriesById,
  sortSubcategories,
} from "~/stores/categoriesOrder";
import { useDataTableColumns } from "./columns/useDataTableColumns";
import { RowActions } from "./RowActions";

interface Props {
  data: TableData[];
  currentMonth: number;
  currentYear: number;
  isRangePicker: boolean;
  groupBySubcategories: boolean;
  tableInstanceRef: React.MutableRefObject<MRT_TableInstance<TableData> | null>;
}

// eslint-disable-next-line mobx/missing-observer
export const DataTable: React.FC<Props> = ({
  data,
  groupBySubcategories,
  tableInstanceRef,
  currentYear,
  currentMonth,
  isRangePicker,
}) => {
  const columns = useDataTableColumns({
    year: currentYear,
    month: currentMonth,
    isRangePicker,
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
    enableColumnActions: true,
    initialState: {
      grouping: ["isIncome", "categoryId"],
      expanded: true,
      sorting: [
        { id: "categoryId", desc: false },
        { id: "subcategoryId", desc: false },
      ],
      density: "compact",
      columnVisibility: { subcategoryId: false },
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
            <div>Имя</div>
          </Space>
        ),
        Cell: ({ row, table }) => {
          return (
            <>
              <MRT_ExpandButton row={row} table={table} />
              {row.getIsGrouped() ? (
                row.depth === 0 ? (
                  row.getGroupingValue("isIncome")
                ) : row.depth === 1 ? (
                  <NameWithOptionalIcon
                    name={row.original.category}
                    icon={row.original.categoryIcon}
                  />
                ) : (
                  row.original.subcategory ?? "<без подкатегории>"
                )
              ) : (
                row.original.name
              )}
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
          ? sortAllCategoriesById(
              (rowA.getGroupingValue("categoryId") as number) ?? "",
              (rowB.getGroupingValue("categoryId") as number) ?? ""
            )
          : 0;
      },
      sortSubcategories: (rowA, rowB) => {
        return rowA.getIsGrouped() && rowB.getIsGrouped()
          ? sortSubcategories(
              rowA.getGroupingValue("categoryId") as number,
              rowA.getGroupingValue("subcategoryId") as number | null,
              rowB.getGroupingValue("subcategoryId") as number | null
            )
          : 0;
      },
    },
    localization: MRT_Localization_RU,
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        color: row.original.isUpcomingSubscription ? "darkgray" : undefined,
      },
    }),
  });

  useEffect(() => {
    tableInstanceRef.current = table;
  }, [table, tableInstanceRef]);

  useEffect(() => {
    if (groupBySubcategories) {
      table.setGrouping(["isIncome", "categoryId", "subcategoryId"]);
    } else {
      table.setGrouping(["isIncome", "categoryId"]);
    }
  }, [groupBySubcategories, table]);

  return <MaterialReactTable table={table} />;
};
