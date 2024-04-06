import { createMRTColumnHelper } from "material-react-table";
import { useMemo } from "react";
import { type TableData } from "~/models/Expense";
import { type AggCostCol } from "~/types/data";
import CostAggregatedCellRenderer from "./CostCellRenderer/CostAggregatedCellRenderer";
import CostCellRenderer from "./CostCellRenderer/CostCellRenderer";
import costAggregationFn from "./utils/costAggregationFn";

export const useDataTableColumns = ({
  categoriesForecast,
  savingSpendingsForecast,
  passedDaysRatio,
}: {
  categoriesForecast: Record<number, number> | null;
  savingSpendingsForecast: number;
  passedDaysRatio: number;
}) => {
  const columnHelper = createMRTColumnHelper<TableData>();
  return useMemo(
    () => [
      columnHelper.accessor("cost", {
        size: 150,
        header: "Сумма",
        aggregationFn: (columnId, leafRows) =>
          costAggregationFn(
            leafRows,
            categoriesForecast,
            savingSpendingsForecast
          ),
        AggregatedCell: ({ cell }) => (
          <CostAggregatedCellRenderer
            passedDaysRatio={passedDaysRatio}
            value={cell.getValue() as AggCostCol | null}
          />
        ),
        Cell: ({ cell }) => <CostCellRenderer value={cell.getValue()} />,
      }),
      columnHelper.accessor("date", {
        size: 130,
        header: "Дата",
        // filter: true,
      }),
      columnHelper.accessor("source", {
        size: 130,
        header: "Источник",
      }),

      columnHelper.accessor("category", {
        header: "Категория",
        sortingFn: "sortCategories",
      }),
    ],
    [categoriesForecast, columnHelper, passedDaysRatio, savingSpendingsForecast]
  );
};
