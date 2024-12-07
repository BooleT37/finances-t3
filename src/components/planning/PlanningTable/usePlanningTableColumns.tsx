import Decimal from "decimal.js";
import { createMRTColumnHelper, type MRT_Row } from "material-react-table";
import { useMemo } from "react";
import { TOTAL_ROW_CATEGORY_ID } from "~/models/Category";
import { type ForecastTableItem } from "~/stores/ForecastStore/types";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";
import { costToString } from "~/utils/costUtils";
import CostCellRenderer from "../CostCellRenderer";
import LastMonthCellRenderer from "../LastMonthCellRenderer";
import ThisMonthCellRenderer from "../ThisMonthCellRenderer";
import { getValueFromTotalRow } from "./getValueFromTotalRow";

const columnHelper = createMRTColumnHelper<ForecastTableItem>();

export interface ForecastSumFromEdit {
  value: Decimal;
  subscriptions: ForecastSubscriptionsItem[];
}

interface Params {
  saveSum: (
    categoryId: number,
    subcategoryId: number | null,
    sum: Decimal,
    row: MRT_Row<ForecastTableItem>
  ) => Promise<void>;
  saveComment: (
    categoryId: number,
    subcategoryId: number | null,
    comment: string
  ) => Promise<void>;
}

const usePlanningTableColumns = ({ saveSum, saveComment }: Params) =>
  useMemo(
    () => [
      columnHelper.accessor((row) => costToString(row.average), {
        id: "average",
        header: "В среднем",
        size: 150,
        enableEditing: false,
        sortingFn: (rowA, rowB) =>
          rowA.original.average.comparedTo(rowB.original.average),
      }),
      columnHelper.accessor("lastMonth", {
        header: "Прошлый месяц",
        size: 160,
        Cell: ({ cell }) => <LastMonthCellRenderer value={cell.getValue()} />,
        enableEditing: false,
        sortingFn: (rowA, rowB) =>
          rowA.original.lastMonth.spendings.comparedTo(
            rowB.original.lastMonth.spendings
          ),
        aggregationFn: getValueFromTotalRow,
        AggregatedCell: ({ cell }) => (
          <LastMonthCellRenderer value={cell.getValue()} />
        ),
      }),
      columnHelper.accessor("sum", {
        header: "План",
        size: 200,
        Cell: ({ cell, row }) => (
          <CostCellRenderer
            cost={cell.getValue()}
            subscriptions={row.original.subscriptions}
            data={row.original}
            saveSum={(
              categoryId: number,
              subcategoryId: number | null,
              sum: Decimal
            ) => saveSum(categoryId, subcategoryId, sum, row)}
            parentData={cell.row.getParentRow()?.original ?? null}
            showSubcategoriesTooltip={
              (cell.row.depth === 1 &&
                cell.row.original.subRows
                  ?.filter((r) => !r.isRestRow)
                  ?.some((r) => !r.sum?.isZero())) ??
              false
            }
          />
        ),
        enableEditing: ({ original, depth }) =>
          depth > 0 &&
          original.categoryId !== TOTAL_ROW_CATEGORY_ID &&
          original.categoryType !== "FROM_SAVINGS" &&
          (!original.subRows ||
            original.subRows
              .filter((row) => !row.isRestRow)
              .every((r) => !r.sum || r.sum.isZero())),
        muiEditTextFieldProps: ({ row, table }) => ({
          type: "number",
          onBlur: (event) => {
            const { value } = event.target;
            const parsed = new Decimal(value || 0);
            if (!parsed.isNaN() && row.original.categoryId !== null) {
              void saveSum(
                row.original.categoryId,
                row.original.subcategoryId,
                parsed,
                row
              );
            }
          },
          onKeyDown: (event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              table.setEditingCell(null);
            }
          },
        }),
        sortingFn: (rowA, rowB) =>
          (rowA.original.sum ?? new Decimal(0)).comparedTo(
            rowB.original.sum ?? new Decimal(0)
          ),
      }),
      columnHelper.accessor("thisMonth", {
        header: "Факт",
        size: 160,
        Cell: ({ cell }) => <ThisMonthCellRenderer value={cell.getValue()} />,
        enableEditing: false,
        sortingFn: (rowA, rowB) =>
          rowA.original.thisMonth.spendings.comparedTo(
            rowB.original.thisMonth.spendings
          ),
        aggregationFn: getValueFromTotalRow,
        AggregatedCell: ({ cell }) => (
          <ThisMonthCellRenderer value={cell.getValue()} />
        ),
      }),
      columnHelper.accessor("comment", {
        header: "Комментарий",
        enableSorting: false,
        size: 200,
        enableEditing: ({ original, depth }) =>
          depth > 0 &&
          original?.categoryId !== TOTAL_ROW_CATEGORY_ID &&
          !original?.isRestRow,
        muiEditTextFieldProps: ({ row }) => ({
          onBlur: (event) => {
            const { value } = event.target;
            if (row.original.categoryId !== null) {
              void saveComment(
                row.original.categoryId,
                row.original.subcategoryId,
                value
              );
            }
          },
        }),
      }),
    ],
    [saveComment, saveSum]
  );

export default usePlanningTableColumns;
