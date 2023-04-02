import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { groupBy, sum } from "lodash";
import { observer } from "mobx-react";
import { CATEGORY_IDS } from "~/models/Category";
import expenseStore from "~/stores/expenseStore";
import costToString from "~/utils/costToString";
import roundCost from "~/utils/roundCost";

interface BarDatum {
  event: string;
  total: number;
}

export const SavingsSpendingsEventsChart: React.FC = observer(
  function MostSpendingsStep() {
    const { expensesByCategoryIdForYear } = expenseStore;

    const expenses =
      expensesByCategoryIdForYear(2022)[CATEGORY_IDS.fromSavings.toString()];

    if (!expenses) {
      return null;
    }

    const data: BarDatum[] = Object.entries(
      groupBy(expenses, "savingSpending.spending.id")
    )
      .map(([_, expenses]) => ({
        event: expenses[0]?.savingSpending?.spending.name ?? "",
        total: roundCost(sum(expenses.map((e) => e.cost ?? 0))),
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
            renderer: ({
              xValue,
              yValue,
            }: AgCartesianSeriesTooltipRendererParams) => ({
              title: xValue as string,
              content: costToString(yValue as number),
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
      </div>
    );
  }
);
