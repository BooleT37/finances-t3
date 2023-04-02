import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { sum } from "lodash";
import { observer } from "mobx-react";
import { CATEGORY_IDS } from "~/models/Category";
import expenseStore from "~/stores/expenseStore";
import costToString from "~/utils/costToString";
import roundCost from "~/utils/roundCost";

interface BarDatum {
  category: string;
  total: number;
}

export const SavingsVsSpendingsChart: React.FC = observer(
  function MostSpendingsStep() {
    const { expensesByCategoryIdForYear } = expenseStore;

    const totalSavings = roundCost(
      sum(
        expensesByCategoryIdForYear(2022)[
          CATEGORY_IDS.toSavings.toString()
        ]?.map((e) => e.cost ?? 0)
      )
    );

    const totalSpendings = roundCost(
      sum(
        expensesByCategoryIdForYear(2022)[
          CATEGORY_IDS.fromSavings.toString()
        ]?.map((e) => e.cost ?? 0)
      )
    );

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
            renderer: ({
              xValue,
              yValue,
            }: AgCartesianSeriesTooltipRendererParams) => ({
              title: xValue as string,
              content: `${costToString(
                yValue as number
              )} (в среднем ${costToString(roundCost(yValue / 12))}/мес)`,
            }),
          },
          label: {
            formatter: (params) => costToString(params.value),
            placement: "outside",
          },
        },
      ],
    };

    return (
      <div>
        <AgChartsReact options={options}></AgChartsReact>
        <div>
          Всего мы за год сохранили{" "}
          <b>{costToString(roundCost(totalSavings - totalSpendings))}</b>
        </div>
      </div>
    );
  }
);
