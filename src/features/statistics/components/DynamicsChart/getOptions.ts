import {
  type AgChartOptions,
  type AgSeriesTooltipRendererParams,
  type AgTooltipRendererResult,
} from "ag-charts-community";
import type DynamicsData from "~/features/statistics/types/dynamicsData";
import type { DynamicsDataMonth } from "~/features/statistics/types/dynamicsData";
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
    type: "line",
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
        datum,
      }: AgSeriesTooltipRendererParams<DynamicsDataMonth>): AgTooltipRendererResult => {
        const value = datum[category.id.toString()]!;
        const formattedValue = costToString(category.isIncome ? value : -value);
        return {
          title: category.shortname,
          data: [
            {
              label: datum.month,
              value: formattedValue,
            },
          ],
        };
      },
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
