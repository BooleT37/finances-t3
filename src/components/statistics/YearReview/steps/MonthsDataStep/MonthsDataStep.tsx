import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { Checkbox } from "antd";
import dayjs from "dayjs";
import { maxBy, range } from "lodash";
import { observer } from "mobx-react";
import { useState } from "react";
import { dataStores } from "~/stores/dataStores";
import { costToString } from "~/utils/costUtils";

import { decimalSum } from "~/utils/decimalSum";
import { CategoriesBreakdown } from "./CategoriesBreakdown";

interface Datum {
  month: string;
  spent: number;
  earned: number;
  saved: number;
}

export const MonthsDataStep: React.FC = observer(function MonthsDataStep() {
  const { expenses } = dataStores.expenseStore;
  const [showFromSavings, setShowFromSavings] = useState(true);

  const thisYearExpenses = expenses.filter((e) => e.date.year() === 2022);

  const data: Datum[] = range(0, 12).map((month) => ({
    month: dayjs().month(month).format("MMMM"),
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
        type: "column",
        xKey: "month",
        yKey: "spent",
        yName: "Потрачено",
        fill: "orangered",
        tooltip: {
          renderer: ({
            yValue,
            yName,
          }: AgCartesianSeriesTooltipRendererParams) => ({
            title: yName,
            content: `${costToString(yValue as number)}`,
          }),
        },
      },
      {
        type: "column",
        xKey: "month",
        yKey: "earned",
        yName: "Заработано",
        fill: "#50C878",
        tooltip: {
          renderer: ({
            yValue,
            yName,
          }: AgCartesianSeriesTooltipRendererParams) => ({
            title: yName,
            content: `${costToString(yValue as number)}`,
          }),
        },
      },
      {
        type: "column",
        xKey: "month",
        yKey: "saved",
        yName: "Отложено",
        fill: "dodgerblue",
        tooltip: {
          renderer: ({
            yValue,
            yName,
          }: AgCartesianSeriesTooltipRendererParams) => ({
            title: yName,
            content: `${costToString(yValue as number)}`,
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
      <AgChartsReact options={options}></AgChartsReact>
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
});
