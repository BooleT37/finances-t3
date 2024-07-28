import Decimal from "decimal.js";
import { createMRTColumnHelper } from "material-react-table";
import { useMemo } from "react";
import { TOTAL_ROW_CATEGORY_ID } from "~/models/Category";
import { sortAllCategoriesByName } from "~/stores/categoriesOrder";
import {
  type ForecastTableItem,
  type ForecastTableItemGroup,
} from "~/stores/ForecastStore/types";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";
import costToString from "~/utils/costToString";
import CostCellRenderer from "../CostCellRenderer";
import LastMonthCellRenderer from "../LastMonthCellRenderer";
import ThisMonthCellRenderer from "../ThisMonthCellRenderer";
import { getValueFromTotalRow } from "./getValueFromTotalRow";

const columnHelper = createMRTColumnHelper<ForecastTableItem>();

export interface ForecastSumFromEdit {
  value: Decimal;
  subscriptions: ForecastSubscriptionsItem[];
}

const GROUPS_ORDER: ForecastTableItemGroup[] = [
  "expense",
  "savings",
  "personal",
  "income",
];

interface Params {
  saveSum: (categoryId: number, sum: Decimal) => Promise<void>;
  saveComment: (categoryId: number, comment: string) => Promise<void>;
  transferPersonalExpense: (categoryId: number) => Promise<void>;
}

const usePlanningTableColumns = ({
  saveSum,
  saveComment,
  transferPersonalExpense,
}: Params) =>
  useMemo(
    () => [
      columnHelper.accessor("group", {
        header: "Группа",
        size: 150,
        enableEditing: false,
      }),
      columnHelper.accessor("category", {
        header: "Категория",
        size: 250,
        sortingFn: (rowA, rowB) => {
          if (
            rowA.getGroupingValue("group") !== rowB.getGroupingValue("group")
          ) {
            return (
              GROUPS_ORDER.indexOf(
                rowA.getGroupingValue("group") as ForecastTableItemGroup
              ) -
              GROUPS_ORDER.indexOf(
                rowB.getGroupingValue("group") as ForecastTableItemGroup
              )
            );
          }
          if (rowA.getGroupingValue("category") === "Всего") {
            return 1;
          }
          if (rowB.getGroupingValue("category") === "Всего") {
            return -1;
          }
          return sortAllCategoriesByName(
            (rowA.getGroupingValue("category") as string) ?? "",
            (rowB.getGroupingValue("category") as string) ?? ""
          );
        },
        enableEditing: false,
      }),
      columnHelper.accessor((row) => costToString(row.average), {
        id: "average",
        header: "В среднем",
        size: 150,
        enableEditing: false,
        sortingFn: (rowA, rowB) =>
          rowA.original.average.comparedTo(rowB.original.average),
        aggregationFn: getValueFromTotalRow,
        AggregatedCell: ({ cell, row }) =>
          row.getIsExpanded() ? "" : cell.getValue(),
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
        AggregatedCell: ({ cell, row }) =>
          row.getIsExpanded() ? (
            ""
          ) : (
            <LastMonthCellRenderer value={cell.getValue()} />
          ),
      }),
      columnHelper.accessor("sum", {
        header: "План",
        size: 200,
        Cell: ({ cell }) => (
          <CostCellRenderer
            value={cell.getValue()}
            data={cell.row.original}
            saveSum={saveSum}
            transferPersonalExpense={transferPersonalExpense}
          />
        ),
        enableEditing: ({ original, depth }) =>
          depth > 0 &&
          original?.categoryId !== TOTAL_ROW_CATEGORY_ID &&
          original?.categoryType !== "FROM_SAVINGS",
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: "number",
          defaultValue: cell.getValue()?.value?.toFixed() ?? "",
          onBlur: (event) => {
            const { value } = event.target;
            const parsed = new Decimal(value || 0);
            if (!parsed.isNaN()) {
              void saveSum(row.original.categoryId, parsed);
            }
          },
        }),
        sortingFn: (rowA, rowB) =>
          (rowA.original.sum.value ?? new Decimal(0)).comparedTo(
            rowB.original.sum.value ?? new Decimal(0)
          ),
        aggregationFn: getValueFromTotalRow,
        AggregatedCell: ({ cell, row }) =>
          row.getIsExpanded() ? (
            ""
          ) : (
            <CostCellRenderer
              value={cell.getValue()}
              data={cell.row.original}
              saveSum={saveSum}
              transferPersonalExpense={transferPersonalExpense}
            />
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
        AggregatedCell: ({ cell, row }) =>
          row.getIsExpanded() ? (
            ""
          ) : (
            <ThisMonthCellRenderer value={cell.getValue()} />
          ),
      }),
      columnHelper.accessor("comment", {
        header: "Комментарий",
        enableSorting: false,
        size: 200,
        enableEditing: ({ original, depth }) =>
          depth > 0 && original?.categoryId !== TOTAL_ROW_CATEGORY_ID,
        muiEditTextFieldProps: ({ row }) => ({
          onBlur: (event) => {
            const { value } = event.target;
            void saveComment(row.original.categoryId, value);
          },
        }),
      }),
    ],
    [saveComment, saveSum, transferPersonalExpense]
  );

export default usePlanningTableColumns;
