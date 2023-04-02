import {
  type AgCartesianSeriesTooltipRendererParams,
  type AgChartOptions,
} from "ag-charts-community";
import { AgChartsReact } from "ag-charts-react";
import costToString from "~/utils/costToString";
import roundCost from "~/utils/roundCost";

export interface SubscriptionDatum {
  name: string;
  spent: number;
}

interface Props {
  title: string;
  yName: string;
  data: SubscriptionDatum[];
}

// eslint-disable-next-line mobx/missing-observer
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
            yValue,
            datum,
          }: AgCartesianSeriesTooltipRendererParams) => ({
            title: (datum as { name: string }).name,
            content: `${costToString(yValue as number)} (${costToString(
              roundCost(yValue / 12)
            )}/мес)`,
          }),
        },
        label: {
          formatter: (params) => costToString(params.value),
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
