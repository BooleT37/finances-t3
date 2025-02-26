import {
  type AgChartOptions,
  type AgSeriesTooltipRendererParams,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { Checkbox } from "antd";
import { maxBy, range } from "lodash";
import { useState } from "react";
import { costToString } from "~/utils/costUtils";

import { useExpenses } from "~/features/expense/facets/allExpenses";
import { decimalSum } from "~/utils/decimalSum";
import { getToday } from "~/utils/today";
import { CategoriesBreakdown } from "./CategoriesBreakdown";

interface Datum {
  month: string;
  spent: number;
  earned: number;
  saved: number;
}

export const MonthsDataStep: React.FC = () => {
  const { data: expenses = [] } = useExpenses();
  const [showFromSavings, setShowFromSavings] = useState(true);

  const thisYearExpenses = expenses.filter((e) => e.date.year() === 2022);

  const data: Datum[] = range(0, 12).map((month) => ({
    month: getToday().month(month).format("MMMM"),
    spent: decimalSum(
      ...thisYearExpenses
        .filter(
          (e) =>
            (showFromSavings || !e.category.fromSavings) &&
            !e.category.isIncome &&
            !e.category.toSavings &&
            e.date.month() === month
        )
        .map((e) => e.cost ?? 0)
    ).toNumber(),
    earned: decimalSum(
      ...thisYearExpenses
        .filter((e) => e.category.isIncome && e.date.month() === month)
        .map((e) => e.cost ?? 0)
    ).toNumber(),
    saved: decimalSum(
      ...thisYearExpenses
        .filter((e) => e.category.toSavings && e.date.month() === month)
        .map((e) => e.cost ?? 0)
    ).toNumber(),
  }));

  const options: AgChartOptions = {
    title: {
      text: "Расходы и доходы по месяцам",
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "month",
        yKey: "spent",
        yName: "Потрачено",
        fill: "orangered",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<Datum>) => ({
            title: "Потрачено",
            content: `${costToString(datum.spent)}`,
          }),
        },
      },
      {
        type: "bar",
        xKey: "month",
        yKey: "earned",
        yName: "Заработано",
        fill: "#50C878",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<Datum>) => ({
            title: "Заработано",
            content: `${costToString(datum.earned)}`,
          }),
        },
      },
      {
        type: "bar",
        xKey: "month",
        yKey: "saved",
        yName: "Отложено",
        fill: "dodgerblue",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<Datum>) => ({
            title: "Отложено",
            content: `${costToString(datum.saved)}`,
          }),
        },
      },
    ],
  };

  const mostExpensiveMonth = maxBy(data, "spent");
  const mostExpensiveMonthIndex = data.findIndex(
    (d) => d.month === mostExpensiveMonth?.month
  );

  return (
    <div>
      <Checkbox
        checked={showFromSavings}
        onChange={(e) => {
          setShowFromSavings(e.target.checked);
        }}
      >
        Учитывать траты из сбережений
      </Checkbox>
      <AgCharts options={options} />
      {mostExpensiveMonth && (
        <div>
          <div>
            Самый дорогой месяц:{" "}
            <b>
              {mostExpensiveMonth.month} (
              {costToString(mostExpensiveMonth.spent)})
            </b>
          </div>
          <CategoriesBreakdown
            month={mostExpensiveMonthIndex}
            showFromSavings={showFromSavings}
          />
        </div>
      )}
    </div>
  );
};
