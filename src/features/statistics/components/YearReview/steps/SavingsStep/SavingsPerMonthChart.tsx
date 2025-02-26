import {
  type AgChartOptions,
  type AgSeriesTooltipRendererParams,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { Spin } from "antd";
import Decimal from "decimal.js";
import { range } from "lodash";
import {
  useFromSavingsCategory,
  useToSavingsCategory,
} from "~/features/category/facets/savingsCategories";
import { useGetExpensesByCategoryIdForYear } from "~/features/expense/facets/expensesByCategory";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";
import { getToday } from "~/utils/today";

interface BarDatum {
  month: string;
  saved: number;
  spent: number;
}

export const SavingsPerMonthChart: React.FC = () => {
  const toSavingsCategory = useToSavingsCategory();
  const fromSavingsCategory = useFromSavingsCategory();
  const getExpensesByCategoryIdForYear = useGetExpensesByCategoryIdForYear();

  if (!toSavingsCategory || !fromSavingsCategory) {
    return <Spin />;
  }

  const savingsExpenses =
    getExpensesByCategoryIdForYear(2022)[toSavingsCategory.id.toString()];

  const spendingsExpenses =
    getExpensesByCategoryIdForYear(2022)[fromSavingsCategory.id.toString()];

  if (!savingsExpenses || !spendingsExpenses) {
    return null;
  }

  const data: BarDatum[] = range(0, 12).map((month) => ({
    month: getToday().month(month).format("MMMM"),
    saved: decimalSum(
      ...savingsExpenses
        .filter((e) => e.date.month() === month)
        .map((e) => e.cost ?? new Decimal(0))
    ).toNumber(),
    spent: decimalSum(
      ...spendingsExpenses
        .filter((e) => e.date.month() === month)
        .map((e) => e.cost ?? new Decimal(0))
    ).toNumber(),
  }));

  const options: AgChartOptions = {
    title: {
      text: "Как мы откладывали деньги по месяцам",
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "month",
        yKey: "saved",
        yName: "Отложено",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<BarDatum>) => ({
            title: "Отложено",
            content: `${costToString(datum.saved)}`,
          }),
        },
      },
      {
        type: "bar",
        xKey: "month",
        yKey: "spent",
        yName: "Потрачено",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<BarDatum>) => ({
            title: "Потрачено",
            content: `${costToString(datum.spent)}`,
          }),
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
