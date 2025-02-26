import { type AgCartesianChartOptions } from "ag-charts-community";
import { costToString } from "~/utils/costUtils";
import type { ComparisonData } from "./models";

const getOptions = (
  period1: string,
  period2: string,
  data: ComparisonData
): AgCartesianChartOptions => ({
  height: 600,
  data,
  series: [
    {
      type: "bar",
      direction: "horizontal",
      xKey: "category",
      yKey: "period1",
      yName: period1,
    },
    {
      type: "bar",
      direction: "horizontal",
      xKey: "category",
      yKey: "period2",
      yName: period2,
    },
  ],
  axes: [
    {
      type: "number",
      position: "bottom",
      label: {
        formatter: (params: { value: string }) =>
          costToString(parseFloat(params.value)),
      },
    },
    {
      type: "category",
      position: "left",
    },
  ],
});

export default getOptions;
