import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import dayjs from "dayjs";
import { range, sum } from "lodash";
import { observer } from "mobx-react";
import { CATEGORY_IDS } from "~/models/Category";
import expenseStore from "~/stores/expenseStore";
import costToString from "~/utils/costToString";
import roundCost from "~/utils/roundCost";

interface BarDatum {
  month: string;
  saved: number;
  spent: number;
}

export const SavingsPerMonthChart: React.FC = observer(
  function MostSpendingsStep() {
    const { expensesByCategoryIdForYear } = expenseStore;

    const savingsExpenses =
      expensesByCategoryIdForYear(2022)[CATEGORY_IDS.toSavings.toString()];

    const spendingsExpenses =
      expensesByCategoryIdForYear(2022)[CATEGORY_IDS.fromSavings.toString()];

    if (!savingsExpenses || !spendingsExpenses) {
      return null;
    }

    const data: BarDatum[] = range(0, 12).map((month) => ({
      month: dayjs().month(month).format("MMMM"),
      saved: roundCost(
        sum(
          savingsExpenses
            .filter((e) => e.date.month() === month)
            .map((e) => e.cost ?? 0)
        )
      ),
      spent: roundCost(
        sum(
          spendingsExpenses
            .filter((e) => e.date.month() === month)
            .map((e) => e.cost ?? 0)
        )
      ),
    }));

    const options: AgChartOptions = {
      title: {
        text: "Как мы откладывали деньги по месяцам",
      },
      data,
      series: [
        {
          type: "column",
          xKey: "month",
          yKey: "saved",
          yName: "Отложено",
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
          yKey: "spent",
          yName: "Потрачено",
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

    return (
      <div>
        <AgChartsReact options={options}></AgChartsReact>
      </div>
    );
  }
);
