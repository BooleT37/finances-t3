import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useGetExpensesByCategoryIdForYear } from "~/features/expense/facets/expensesByCategory";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";

interface BarDatum {
  category: string;
  spent: number;
}

interface Props {
  month: number;
  showFromSavings: boolean;
}

export const CategoriesBreakdown: React.FC<Props> = ({
  month,
  showFromSavings,
}) => {
  const getExpensesByCategoryIdForYear = useGetExpensesByCategoryIdForYear();

  const expenses = getExpensesByCategoryIdForYear(2022);
  const categoryById = useGetCategoryById();

  const data: BarDatum[] = categoryById.loaded
    ? Object.entries(expenses)
        .filter(([categoryId]) => {
          const category = categoryById.getCategoryById(parseInt(categoryId));
          return (
            (showFromSavings || !category.fromSavings) && !category.isIncome
          );
        })
        .map(([categoryId, expenses]): [string, number] => [
          categoryId,
          decimalSum(
            ...expenses
              .filter((e) => e.date.month() === month)
              .map((e) => e.cost ?? 0)
          ).toNumber(),
        ])
        .sort((e1, e2) => e2[1] - e1[1])
        .slice(0, 3)
        .map(
          ([categoryId, spent]): BarDatum => ({
            category: categoryById.getCategoryById(parseInt(categoryId)).name,
            spent,
          })
        )
    : [];

  const options: AgChartOptions = {
    title: {
      text: "На что мы потратили больше всего в этом месяце?",
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "category",
        yKey: "spent",
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
          formatter: (params: { value: number }) => costToString(params.value),
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
};
