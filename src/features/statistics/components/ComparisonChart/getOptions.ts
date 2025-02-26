import {
  type AgCartesianChartOptions,
  type AgSeriesTooltipRendererParams,
  type AgTooltipRendererResult,
} from "ag-charts-community";
import { costToString } from "~/utils/costUtils";
import type { ComparisonData } from "./models";
import type { ComparisonDataCategory } from "./models/comparisonData";

const getTooltip = (yKey: "period1" | "period2") => ({
  renderer: ({
    datum,
    title,
  }: AgSeriesTooltipRendererParams<ComparisonDataCategory>): AgTooltipRendererResult => {
    const value = datum[yKey];

    const cost = datum.isIncome ? value : -value;
    return {
      title,
      data: [
        {
          label: "Всего:",
          value: costToString(cost),
        },
      ],
    };
  },
});

const getOptions = (
  period1: string,
  period2: string,
  data: ComparisonData
): AgCartesianChartOptions => ({
  data,
  series: [
    {
      type: "bar",
      xKey: "category",
      yKey: "period1",
      yName: period1,
      tooltip: getTooltip("period1"),
    },
    {
      type: "bar",
      xKey: "category",
      yKey: "period2",
      yName: period2,
      tooltip: getTooltip("period2"),
    },
  ],
  axes: [
    {
      type: "category",
      position: "bottom",
    },
    {
      type: "number",
      position: "left",
      label: {
        formatter: (params: { value: string }) =>
          costToString(parseFloat(params.value)),
      },
    },
  ],
});

export default getOptions;
