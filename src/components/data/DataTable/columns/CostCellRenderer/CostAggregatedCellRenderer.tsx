import React from "react";
import TotalCostCellView from "~/components/TotalCostCellView";
import { type AggCostCol } from "~/types/data";
import costToString from "~/utils/costToString";

import CostCellView from "./CostCellView";

interface Props {
  isSubcategory: boolean;
  value: AggCostCol | null;
  passedDaysRatio: number | null;
}

// eslint-disable-next-line mobx/missing-observer
const CostAggregatedCellRenderer: React.FC<Props> = ({
  value: col,
  isSubcategory,
  passedDaysRatio,
}) => {
  if (!col) {
    return null;
  }
  const costString = costToString(col.value);
  if (isSubcategory || col.diff === null) {
    return (
      <CostCellView
        cost={costString}
        isSubscription={col.isSubscription}
        isUpcomingSubscription={col.isUpcomingSubscription}
      />
    );
  }
  const diffNumber = col.diff.toNumber();
  const valueNumber = col.value.toNumber();
  const diffSum = costToString(col.diff.abs());
  if (col.isIncome) {
    if (col.diff.isZero()) {
      return <TotalCostCellView cost={costString} color="white" barWidth={1} />;
    }
    if (col.diff.isPositive()) {
      return (
        <TotalCostCellView
          cost={costString}
          suffix={`-${diffSum}`}
          color="red"
          barWidth={diffNumber / col.diff.plus(col.value).toNumber()}
        />
      );
    }
    return (
      <TotalCostCellView
        cost={costString}
        suffix={`+${diffSum}`}
        color="green"
        barWidth={-diffNumber / valueNumber}
        barOffset={diffNumber / valueNumber + 1}
      />
    );
  }
  if (col.diff.isZero()) {
    return <TotalCostCellView cost={costString} color="white" barWidth={1} />;
  }
  if (col.diff.isPositive()) {
    const spentRatio = valueNumber / (diffNumber + valueNumber);
    const exceedingForecast =
      col.isContinuous &&
      passedDaysRatio !== null &&
      spentRatio > passedDaysRatio;
    const color = exceedingForecast ? "orange" : "green";

    const exceedingAmount = exceedingForecast
      ? costToString(valueNumber - passedDaysRatio * (valueNumber + diffNumber))
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
      />
    );
  }

  const spentRatio = Math.min(-diffNumber / valueNumber, 1);
  const offset = Math.max(diffNumber / valueNumber + 1, 0);

  return (
    <TotalCostCellView
      cost={costString}
      suffix={`-${diffSum}`}
      color="red"
      barWidth={spentRatio}
      barOffset={offset}
    />
  );
};

export default CostAggregatedCellRenderer;
