import {
  type AgChartLabelFormatterParams,
  type AgChartOptions,
  type AgSeriesTooltipRendererParams,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { Button } from "antd";
import { useState } from "react";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useGetExpensesByCategoryIdForYear } from "~/features/expense/facets/expensesByCategory";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";

interface BarDatum {
  category: string;
  spent: number;
}

export const MostSpendingsStep: React.FC = () => {
  const [allCategoriesShown, setAllCategoriesShown] = useState(false);
  const getExpensesByCategoryIdForYear = useGetExpensesByCategoryIdForYear();
  const expenses = getExpensesByCategoryIdForYear(2022);
  const categoryById = useGetCategoryById();

  const data: BarDatum[] = categoryById.loaded
    ? Object.entries(expenses)
        .filter(([categoryId]) => {
          const category = categoryById.getCategoryById(parseInt(categoryId));
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
            category: categoryById.getCategoryById(parseInt(categoryId)).name,
            spent,
          })
        )
    : [];

  const options: AgChartOptions = {
    title: {
      text: "На что мы потратили больше всего?",
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "category",
        yKey: "spent",
        yName: "Потрачено",
        tooltip: {
          renderer: ({ datum }: AgSeriesTooltipRendererParams<BarDatum>) => ({
            title: datum.category,
            content: `${costToString(datum.spent)} (в среднем ${costToString(
              datum.spent / 12
            )}/мес)`,
          }),
        },
        label: allCategoriesShown
          ? undefined
          : {
              formatter: (params: AgChartLabelFormatterParams<BarDatum>) =>
                costToString(params.datum.spent),
              placement: "outside-start",
            },
      },
    ],
  };

  return (
    <div>
      <AgCharts options={options} />
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
};
