import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import type DynamicsData from "~/types/statistics/dynamicsData";
import costToString from "~/utils/costToString";
import { palette } from "./palette";

const getOptions = (
  categories: string[],
  categoriesNames: string[],
  data: DynamicsData
): AgChartOptions => ({
  height: 500,
  width: 1200,
  data,
  series: categories.map((s, i) => ({
    xKey: "month",
    yKey: s,
    yName: categoriesNames[i],
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
        content: `${xValue as string}: ${costToString(yValue as number)}`,
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
