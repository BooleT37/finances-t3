import {
  type AgChartLabelFormatterParams,
  type AgChartOptions,
  type AgSeriesTooltipRendererParams,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { Spin } from "antd";
import {
  useFromSavingsCategory,
  useToSavingsCategory,
} from "~/features/category/facets/savingsCategories";
import { useGetExpensesByCategoryIdForYear } from "~/features/expense/facets/expensesByCategory";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";

interface BarDatum {
  category: string;
  total: number;
}

export const SavingsVsSpendingsChart: React.FC = () => {
  const getExpensesByCategoryIdForYear = useGetExpensesByCategoryIdForYear();
  const toSavingsCategory = useToSavingsCategory();
  const fromSavingsCategory = useFromSavingsCategory();

  if (!toSavingsCategory || !fromSavingsCategory) {
    return <Spin />;
  }

  const totalSavings = decimalSum(
    ...(getExpensesByCategoryIdForYear(2022)[
      toSavingsCategory.id.toString()
    ]?.map((e) => e.cost ?? 0) ?? [])
  ).toNumber();
  const totalSpendings = decimalSum(
    ...(getExpensesByCategoryIdForYear(2022)[
      fromSavingsCategory.id.toString()
    ]?.map((e) => e.cost ?? 0) ?? [])
  ).toNumber();
  const data: BarDatum[] = [
    {
      category: "Отложено",
      total: totalSavings,
    },
    {
      category: "Потрачено",
      total: totalSpendings,
    },
  ];

  const options: AgChartOptions = {
    title: {
      text: "Сбережения: отложено <-> потрачено",
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "category",
        yKey: "total",
        yName: "Сумма",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<BarDatum>) => ({
            title: datum.category,
            content: `${costToString(datum.total)} (в среднем ${costToString(
              datum.total / 12
            )}/мес)`,
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
      <div>
        Всего мы за год сохранили{" "}
        <b>{costToString(totalSavings - totalSpendings)}</b>
      </div>
    </div>
  );
};
