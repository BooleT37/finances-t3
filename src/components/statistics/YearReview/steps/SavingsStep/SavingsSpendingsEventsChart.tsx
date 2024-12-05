import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { groupBy } from "lodash";
import { observer } from "mobx-react";
import { dataStores } from "~/stores/dataStores";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";

interface BarDatum {
  event: string;
  total: number;
}

export const SavingsSpendingsEventsChart: React.FC = observer(
  function MostSpendingsStep() {
    const { expensesByCategoryIdForYear } = dataStores.expenseStore;
    const { fromSavingsCategory } = dataStores.categoriesStore;

    const expenses =
      expensesByCategoryIdForYear(2022)[fromSavingsCategory.id.toString()];

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
