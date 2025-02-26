import {
  type AgChartLabelFormatterParams,
  type AgChartOptions,
  type AgSeriesTooltipRendererParams,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { Spin } from "antd";
import { groupBy } from "lodash";
import { useFromSavingsCategory } from "~/features/category/facets/savingsCategories";
import { useGetExpensesByCategoryIdForYear } from "~/features/expense/facets/expensesByCategory";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";

interface BarDatum {
  event: string;
  total: number;
}

export const SavingsSpendingsEventsChart: React.FC = () => {
  const fromSavingsCategory = useFromSavingsCategory();
  const getExpensesByCategoryIdForYear = useGetExpensesByCategoryIdForYear();

  if (!fromSavingsCategory) {
    return <Spin />;
  }

  const expenses =
    getExpensesByCategoryIdForYear(2022)[fromSavingsCategory.id.toString()];

  if (!expenses) {
    return null;
  }

  const data: BarDatum[] = Object.entries(
    groupBy(expenses, "savingSpending.spending.id")
  )
    .map(([_, expenses]) => ({
      event: expenses[0]?.savingSpending?.spending.name ?? "",
      total: decimalSum(...expenses.map((e) => e.cost ?? 0)).toNumber(),
    }))
    .sort((d1, d2) => d2.total - d1.total);

  const options: AgChartOptions = {
    title: {
      text: "Траты из сбережеий за год",
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "event",
        yKey: "total",
        yName: "Потрачено",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<BarDatum>) => ({
            title: datum.event,
            content: costToString(datum.total),
          }),
        },
        label: {
          formatter: (params: AgChartLabelFormatterParams<BarDatum>) =>
            costToString(params.datum.total),
          placement: "outside-start",
        },
      },
    ],
  };

  return (
    <div>
      <AgCharts options={options} />
    </div>
  );
};
