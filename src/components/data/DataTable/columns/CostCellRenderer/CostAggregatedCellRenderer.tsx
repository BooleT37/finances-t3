import React from "react";
import TotalCostCellView from "~/components/TotalCostCellView";
import { type AggCostCol } from "~/types/data";
import costToString from "~/utils/costToString";
import roundCost from "~/utils/roundCost";
import CostCellView from "./CostCellView";

interface Props {
  value: AggCostCol | null;
  passedDaysRatio: number;
}

// eslint-disable-next-line mobx/missing-observer
const CostAggregatedCellRenderer: React.FC<Props> = ({
  value: col,
  passedDaysRatio,
}) => {
  if (!col) {
    return null;
  }
  const costString = costToString(col.value);
  if (col.diff === null) {
    return (
      <CostCellView
        cost={costString}
        personalExpStr={col.personalExpStr}
        isSubscription={col.isSubscription}
        isUpcomingSubscription={col.isUpcomingSubscription}
      />
    );
  }
  const diffSum = costToString(Math.abs(col.diff));
  if (col.isIncome) {
    if (col.diff >= 0) {
      return (
        <TotalCostCellView
          cost={costString}
          suffix={`-${diffSum}`}
          color="red"
          barWidth={col.diff / (col.diff + col.value)}
          isMuiTable
        />
      );
    }
    return (
      <TotalCostCellView
        cost={costString}
        suffix={`+${diffSum}`}
        color="green"
        barWidth={-col.diff / col.value}
        barOffset={col.diff / col.value + 1}
        isMuiTable
      />
    );
  }
  if (col.diff >= 0) {
    const spentRatio = col.value / (col.diff + col.value);
    const exceedingForecast = col.isContinuous && spentRatio > passedDaysRatio;
    const color = exceedingForecast ? "orange" : "green";

    const exceedingAmount = exceedingForecast
      ? costToString(
          roundCost(col.value - passedDaysRatio * (col.value + col.diff))
        )
      : undefined;
    const title = exceedingAmount
      ? `Превышение на ${exceedingAmount}`
      : undefined;

    return (
      <TotalCostCellView
        cost={costString}
        suffix={`+${diffSum}`}
        color={color}
        barWidth={spentRatio}
        title={title}
        isMuiTable
      />
    );
  }

  const spentRatio = Math.min(-col.diff / col.value, 1);
  const offset = Math.max(col.diff / col.value + 1, 0);

  return (
    <TotalCostCellView
      cost={costString}
      suffix={`-${diffSum}`}
      color="red"
      barWidth={spentRatio}
      barOffset={offset}
      isMuiTable
    />
  );
};

export default CostAggregatedCellRenderer;
