import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import type DynamicsData from "~/features/statistics/types/dynamicsData";
import { costToString } from "~/utils/costUtils";
import { palette } from "./palette";

const getOptions = (
  categories: { id: number; shortname: string; isIncome: boolean }[],
  data: DynamicsData
): AgChartOptions => ({
  height: 500,
  width: 1200,
  data,
  series: categories.map((category) => ({
    xKey: "month",
    yKey: category.id.toString(),
    yName: category.shortname,
    highlightStyle: {
      series: {
        dimOpacity: 0.2,
        strokeWidth: 4,
      },
    },
    tooltip: {
      renderer: ({
        xValue,
        yValue,
      }: AgCartesianSeriesTooltipRendererParams) => ({
        content: `${xValue as string}: ${costToString(
          category.isIncome ? (yValue as number) : -yValue
        )}`,
      }),
    },
  })),
  legend: {
    enabled: true,
    position: "bottom",
  },
  theme: {
    palette,
  },
});

export default getOptions;
