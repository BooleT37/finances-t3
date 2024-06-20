import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { dataStores } from "~/stores/dataStores";
import costToString from "~/utils/costToString";
import { decimalSum } from "~/utils/decimalSum";

interface BarDatum {
  category: string;
  spent: number;
}

export const MostSpendingsStep: React.FC = observer(
  function MostSpendingsStep() {
    const [allCategoriesShown, setAllCategoriesShown] = useState(false);
    const { expensesByCategoryIdForYear } = dataStores.expenseStore;

    const expenses = expensesByCategoryIdForYear(2022);

    const data: BarDatum[] = Object.entries(expenses)
      .filter(([categoryId]) => {
        const category = dataStores.categoriesStore.getById(
          parseInt(categoryId)
        );
        return !category.isIncome && !category.toSavings;
      })
      .map(([categoryId, expenses]): [string, number] => [
        categoryId,
        decimalSum(...expenses.map((e) => e.cost ?? 0)).toNumber(),
      ])
      .sort((e1, e2) => e2[1] - e1[1])
      .slice(0, allCategoriesShown ? Object.keys(expenses).length : 3)
      .map(
        ([categoryId, spent]): BarDatum => ({
          category: dataStores.categoriesStore.getById(parseInt(categoryId))
            .name,
          spent,
        })
      );

    const options: AgChartOptions = {
      title: {
        text: "На что мы потратили больше всего?",
      },
      data,
      series: [
        {
          type: "column",
          xKey: "category",
          yKey: "spent",
          yName: "Потрачено",
          tooltip: {
            renderer: ({
              xValue,
              yValue,
            }: AgCartesianSeriesTooltipRendererParams) => ({
              title: xValue as string,
              content: `${costToString(
                yValue as number
              )} (в среднем ${costToString(yValue / 12)}/мес)`,
            }),
          },
          label: allCategoriesShown
            ? undefined
            : {
                formatter: (params) => costToString(params.value),
                placement: "outside",
              },
        },
      ],
    };

    return (
      <div>
        <AgChartsReact options={options}></AgChartsReact>
        <Button
          type="link"
          onClick={() => {
            setAllCategoriesShown((shown) => !shown);
          }}
        >
          {allCategoriesShown ? "Показать топ 3" : "Показать все"}
        </Button>
      </div>
    );
  }
);
