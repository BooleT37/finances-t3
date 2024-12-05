import React from "react";
import TotalCostCellView from "~/components/TotalCostCellView";
import { costToDiffString, costToString } from "~/utils/costUtils";

import { Space } from "antd";
import Decimal from "decimal.js";
import type { CostCol } from "~/models/Expense";
import { divideWithFallbackToOne } from "~/utils/diffUtils";
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

  const forecast =
    getCostForecast({
      categoryId,
      isSubcategoryRow,
      subcategoryId,
      month,
      year,
      isIncome,
    }) ?? new Decimal(0);
  const forecastNumber = forecast.toNumber();
  const diff = forecast !== undefined ? value.minus(forecast) : value;
  const diffNumber = diff.toNumber();
  const valueNumber = value.toNumber();
  const color = diff.isNeg() ? "red" : "green";
  const tooltip = `План: ${costToString(forecast)}`;

  if (value.abs().lessThanOrEqualTo(forecast.abs())) {
    const spentRatio = divideWithFallbackToOne(valueNumber, forecastNumber);
    const exceedingForecast =
      isContinuous && passedDaysRatio !== null && spentRatio > passedDaysRatio;

    if (exceedingForecast) {
      return (
        <TotalCostCellView
          cost={costString}
          suffix={costToDiffString(diff)}
          color="orange"
          barWidth={spentRatio}
          tooltip={
            <Space direction="vertical">
              <div>{tooltip}</div>
              <div>
                Превышение на{" "}
                {costToString(
                  Math.abs(valueNumber - passedDaysRatio * forecastNumber)
                )}
              </div>
            </Space>
          }
        />
      );
    }

    return (
      <TotalCostCellView
        cost={costString}
        suffix={costToDiffString(diff)}
        color={color}
        barWidth={spentRatio}
        tooltip={tooltip}
      />
    );
  }

  return (
    <TotalCostCellView
      cost={costString}
      suffix={costToDiffString(diff)}
      color={diff.isNeg() ? "red" : "green"}
      barOffset={forecastNumber / valueNumber}
      barWidth={diffNumber / valueNumber}
      tooltip={tooltip}
    />
  );
};

export default CostAggregatedCellRenderer;
