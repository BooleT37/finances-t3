import { createMRTColumnHelper } from "material-react-table";
import { useMemo } from "react";
import { type TableData } from "~/models/Expense";
import CostAggregatedCellRenderer from "./CostCellRenderer/CostAggregatedCellRenderer";
import CostCellRenderer from "./CostCellRenderer/CostCellRenderer";
import { getPassedDaysRatio } from "./utils/getPassedDaysRatio";
import { useCostAggregationFn } from "./utils/useCostAggregationFn";

export const useDataTableColumns = ({
  month,
  year,
  isRangePicker,
}: {
  month: number;
  year: number;
  isRangePicker: boolean;
}) => {
  const columnHelper = createMRTColumnHelper<TableData>();
  const costAggregationFn = useCostAggregationFn();
  const passedDaysRatio = useMemo(
    () =>
      getPassedDaysRatio({
        currentMonth: month,
        currentYear: year,
        isRangePicker,
      }),
    [month, year, isRangePicker]
  );
  return useMemo(
    () => [
      columnHelper.accessor("isIncome", {
        header: "Тип",
        getGroupingValue: (row) => (row.isIncome ? "Доход" : "Расход"),
      }),
      columnHelper.accessor("subcategoryId", {
        header: "Подкатегория",
        sortingFn: "sortSubcategories",
      }),
      columnHelper.accessor("cost", {
        size: 150,
        header: "Сумма",
        // this hides the "group by" button in column menu
        enableGrouping: false,
        aggregationFn: costAggregationFn,
        AggregatedCell: ({ cell, row }) => (
          <CostAggregatedCellRenderer
            passedDaysRatio={passedDaysRatio}
            value={cell.getValue()}
            isIncome={row.original.isIncome}
            isContinuous={row.original.isContinuous}
            isSubcategoryRow={row.groupingColumnId === "subcategoryId"}
            categoryId={
              row.groupingColumnId === "isIncome"
                ? undefined
                : (row.getGroupingValue("categoryId") as number)
            }
            subcategoryId={
              row.getGroupingValue("subcategoryId") as number | undefined
            }
            isRangePicker={isRangePicker}
            month={month}
            year={year}
          />
        ),
        Cell: ({ cell }) => <CostCellRenderer value={cell.getValue()} />,
      }),
      columnHelper.accessor("date", {
        size: 130,
        header: "Дата",
        enableGrouping: false,
      }),
      columnHelper.accessor("source", {
        size: 130,
        header: "Источник",
        enableGrouping: false,
      }),

      columnHelper.accessor("categoryId", {
        header: "Категория",
        sortingFn: "sortCategories",
      }),
    ],
    [
      columnHelper,
      costAggregationFn,
      isRangePicker,
      month,
      passedDaysRatio,
      year,
    ]
  );
};
