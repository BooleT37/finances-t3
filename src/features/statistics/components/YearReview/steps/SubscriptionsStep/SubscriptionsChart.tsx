import {
  type AgChartLabelFormatterParams,
  type AgChartOptions,
  type AgSeriesTooltipRendererParams,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import Decimal from "decimal.js";
import { costToString } from "~/utils/costUtils";

export interface SubscriptionDatum {
  name: string;
  spent: number;
}

interface Props {
  title: string;
  yName: string;
  data: SubscriptionDatum[];
}

export const SubscriptionsChart: React.FC<Props> = (props) => {
  const { title, yName, data } = props;

  const options: AgChartOptions = {
    title: {
      text: title,
    },
    data,
    series: [
      {
        type: "bar",
        xKey: "name",
        yKey: "spent",
        yName,
        tooltip: {
          renderer: ({
            datum,
          }: AgSeriesTooltipRendererParams<SubscriptionDatum>) => ({
            title: datum.name,
            content: `${costToString(datum.spent)} (${costToString(
              new Decimal(datum.spent).div(12)
            )}/мес)`,
          }),
        },
        label: {
          formatter: (params: AgChartLabelFormatterParams<SubscriptionDatum>) =>
            costToString(params.datum.spent),
          placement: "outside-start",
        },
      },
    ],
  };

  return (
    <div>
      <AgCharts options={options} />
    </div>
  );
};
