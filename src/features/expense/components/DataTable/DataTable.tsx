import { Space, Typography } from "antd";
import {
  MaterialReactTable,
  MRT_ExpandAllButton,
  MRT_ExpandButton,
  useMaterialReactTable,
  type MRT_TableInstance,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import React, { useEffect } from "react";
import { NameWithOptionalIcon } from "~/features/category/components/categoryIcons/NameWithOptionalIcon";
import {
  useSortAllCategoriesById,
  useSortSubcategories,
} from "~/features/category/facets/categoriesOrder";
import type { ExpenseTableData } from "~/features/expense/Expense";
import { useDataTableColumns } from "./columns/useDataTableColumns";
import { RowActions } from "./RowActions";

export const expenseNameCellClassName = "data-table-expense-name-cell";

const { Text } = Typography;

function getRowBgColor(depth: number) {
  if (depth === 0) {
    return "#e0e0e0";
  }
  if (depth === 1) {
    return "#f0f0f0";
  }
  return "transparent";
}

interface Props {
  data: ExpenseTableData[] | undefined;
  currentMonth: number;
  currentYear: number;
  isRangePicker: boolean;
  groupBySubcategories: boolean;
  tableInstanceRef: React.MutableRefObject<MRT_TableInstance<ExpenseTableData> | null>;
}

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
  const sortAllCategoriesById = useSortAllCategoriesById();
  const sortSubcategories = useSortSubcategories();
  const table = useMaterialReactTable({
    columns,
    data: data ?? [],
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
    state: {
      isLoading: !data,
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
        Cell: ({ row, table }) => (
          <div
            className={expenseNameCellClassName}
            // for tests to check the category and subcategory ids (not easy to find a parent group in the table)
            data-category-id={
              row.getIsGrouped() ? undefined : row.original.categoryId
            }
            data-subcategory-id={
              !row.getIsGrouped() && row.original.subcategoryId !== null
                ? row.original.subcategoryId
                : undefined
            }
          >
            <MRT_ExpandButton row={row} table={table} />
            {row.getIsGrouped() ? (
              row.depth === 0 ? (
                (row.getGroupingValue("isIncome") as string)
              ) : row.depth === 1 ? (
                <NameWithOptionalIcon
                  name={row.original.category}
                  icon={row.original.categoryIcon}
                />
              ) : (
                row.original.subcategory ?? "<без подкатегории>"
              )
            ) : (
              <Text
                ellipsis
                title={row.original.name}
                style={{
                  maxWidth: "300px",
                }}
              >
                {row.original.name}
              </Text>
            )}
          </div>
        ),
        GroupedCell: ({ row }) => row.original.name,
        size: 200,
      },
    },
    sortingFns: {
      sortCategories: (rowA, rowB) =>
        rowA.getIsGrouped() && rowB.getIsGrouped()
          ? sortAllCategoriesById(
              (rowA.getGroupingValue("categoryId") as number) ?? "",
              (rowB.getGroupingValue("categoryId") as number) ?? ""
            )
          : 0,
      sortSubcategories: (rowA, rowB) =>
        rowA.getIsGrouped() && rowB.getIsGrouped()
          ? sortSubcategories(
              rowA.getGroupingValue("categoryId") as number,
              rowA.getGroupingValue("subcategoryId") as number | null,
              rowB.getGroupingValue("subcategoryId") as number | null
            )
          : 0,
    },
    localization: MRT_Localization_RU,
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        color: row.original.isUpcomingSubscription ? "darkgray" : undefined,
        background: getRowBgColor(row.depth),
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
