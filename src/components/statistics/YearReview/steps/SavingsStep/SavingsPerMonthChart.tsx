import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { range } from "lodash";
import { observer } from "mobx-react";
import { dataStores } from "~/stores/dataStores";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";

interface BarDatum {
  month: string;
  saved: number;
  spent: number;
}

export const SavingsPerMonthChart: React.FC = observer(
  function MostSpendingsStep() {
    const { expensesByCategoryIdForYear } = dataStores.expenseStore;
    const { toSavingsCategory, fromSavingsCategory } =
      dataStores.categoriesStore;

    const savingsExpenses =
      expensesByCategoryIdForYear(2022)[toSavingsCategory.id.toString()];

    const spendingsExpenses =
      expensesByCategoryIdForYear(2022)[fromSavingsCategory.id.toString()];

    if (!savingsExpenses || !spendingsExpenses) {
      return null;
    }

    const data: BarDatum[] = range(0, 12).map((month) => ({
      month: dayjs().month(month).format("MMMM"),
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
