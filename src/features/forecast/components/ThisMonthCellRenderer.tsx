import React from "react";
import type { MonthSpendings } from "~/features/forecast/types";
import { costToDiffString, costToString } from "~/utils/costUtils";
import { divideWithFallbackToOne } from "~/utils/diffUtils";
import TotalCostCellView from "../../../components/TotalCostCellView";

interface Props {
  value: MonthSpendings;
}

const ThisMonthCellRenderer: React.FC<Props> = ({ value: col }) => {
  const spendingsNumber = col.spendings.toNumber();
  const diffNumber = col.diff.toNumber();
  const forecast = col.spendings.minus(col.diff);
  const forecastNumber = forecast.toNumber();
  const color = col.diff.isNeg() ? "red" : "green";

  if (col.spendings.isNeg() !== forecast.isNeg()) {
    return (
      <TotalCostCellView
        cost={costToString(col.spendings)}
        suffix={costToDiffString(col.diff)}
        color={color}
        barWidth={1}
      />
    );
  }

  if (col.spendings.abs().lessThanOrEqualTo(forecast.abs())) {
    return (
      <TotalCostCellView
        cost={costToString(col.spendings)}
        suffix={costToDiffString(col.diff)}
        color={color}
        barWidth={divideWithFallbackToOne(spendingsNumber, forecastNumber)}
      />
    );
  }

  return (
    <TotalCostCellView
      cost={costToString(col.spendings)}
      suffix={costToDiffString(col.diff)}
      color={color}
      // spendingsNumber is never zero as spendings is
      // strictly greater than forecast and they are both positive
      barOffset={forecastNumber / spendingsNumber}
      barWidth={diffNumber / spendingsNumber}
    />
  );
};

export default ThisMonthCellRenderer;
