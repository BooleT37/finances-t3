import type { AgChartOptions } from "ag-charts-community";
import { costToString } from "~/utils/costUtils";
import type { ComparisonData } from "./models";
import type { ComparisonDataCategory } from "./models/comparisonData";

const tooltip = {
  renderer: ({
    xValue,
    yValue,
    datum,
  }: {
    xValue?: string;
    yValue?: number;
    datum: ComparisonDataCategory;
  }) => {
    if (yValue === undefined) return "";
    const cost = datum.isIncome ? yValue : -yValue;
    return {
      content: `${xValue}: ${costToString(cost)}`,
    };
  },
};

const getOptions = (
  period1: string,
  period2: string,
  data: ComparisonData
): AgChartOptions => ({
  autoSize: true,
  data,
  series: [
    {
      type: "column",
      xKey: "category",
      yKey: "period1",
      yName: period1,
      tooltip,
    },
    {
      type: "column",
      xKey: "category",
      yKey: "period2",
      yName: period2,
      tooltip,
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
