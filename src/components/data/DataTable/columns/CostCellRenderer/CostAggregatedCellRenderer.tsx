import React from "react";
import TotalCostCellView from "~/components/TotalCostCellView";
import costToString from "~/utils/costToString";

import Decimal from "decimal.js";
import type { CostCol } from "~/models/Expense";
import CostCellView from "./CostCellView";
import { getCostForecast } from "./getCostForecast";

interface Props {
  value: CostCol | null;
  isIncome: boolean;
  isContinuous: boolean;
  passedDaysRatio: number | null;
  isSubcategoryRow: boolean;
  categoryId: number | undefined;
  subcategoryId: number | undefined;
  isRangePicker: boolean;
  month: number;
  year: number;
}

// eslint-disable-next-line mobx/missing-observer
const CostAggregatedCellRenderer: React.FC<Props> = ({
  value: col,
  passedDaysRatio,
  isSubcategoryRow,
  categoryId,
  subcategoryId,
  isIncome,
  isRangePicker,
  isContinuous,
  month,
  year,
}) => {
  if (!col) {
    return null;
  }
  const { value } = col;
  const costString = costToString(value);
  if (isRangePicker) {
    return (
      <CostCellView
        cost={costString}
        isSubscription={col.isSubscription}
        isUpcomingSubscription={col.isUpcomingSubscription}
      />
    );
  }

  const forecast = getCostForecast({
    categoryId,
    isSubcategoryRow,
    subcategoryId,
    month,
    year,
    isIncome,
  });
  const diff = forecast !== undefined ? forecast.minus(value) : value.neg();
  const diffNumber = diff.toNumber();
  const valueNumber = value.toNumber();
  const diffSum = costToString(diff.abs());
  const tooltip = `План: ${costToString(forecast ?? new Decimal(0))}`;
  if (isIncome) {
    if (diff.isPositive()) {
      return (
        <TotalCostCellView
          cost={costString}
          suffix={`-${diffSum}`}
          color="red"
          barWidth={diffNumber / diff.plus(value).toNumber()}
          tooltip={tooltip}
        />
      );
    }
    return (
      <TotalCostCellView
        cost={costString}
        suffix={diffSum}
        color="green"
        barWidth={-diffNumber / valueNumber}
        barOffset={diffNumber / valueNumber + 1}
        tooltip={tooltip}
      />
    );
  }
  if (diff.isPositive()) {
    const spentRatio = valueNumber / (diffNumber + valueNumber);
    const exceedingForecast =
      isContinuous && passedDaysRatio !== null && spentRatio > passedDaysRatio;
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
        suffix={diffSum}
        color={color}
        barWidth={spentRatio}
        title={title}
        tooltip={tooltip}
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
      tooltip={tooltip}
    />
  );
};

export default CostAggregatedCellRenderer;
