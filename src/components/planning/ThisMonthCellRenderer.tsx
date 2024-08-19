import React from "react";
import { type MonthSpendings } from "~/stores/ForecastStore/types";
import costToString from "~/utils/costToString";
import TotalCostCellView from "../TotalCostCellView";

interface Props {
  value: MonthSpendings;
}

function divideWithFallbackToOne(divident: number, divider: number) {
  return divider === 0 ? 1 : divident / divider;
}

// eslint-disable-next-line mobx/missing-observer
const ThisMonthCellRenderer: React.FC<Props> = ({ value: col }) => {
  const costString = costToString(col.spendings);
  const diffSum = costToString(col.diff.abs());
  const diffNumber = col.diff.toNumber();
  const spendingsNumber = col.spendings.toNumber();

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
          barWidth={divideWithFallbackToOne(
            diffNumber,
            col.diff.add(col.spendings).toNumber()
          )}
        />
      );
    }
    return (
      <TotalCostCellView
        cost={costString}
        suffix={`+${diffSum}`}
        color="green"
        barWidth={divideWithFallbackToOne(-diffNumber, spendingsNumber)}
        barOffset={
          spendingsNumber === 0 ? undefined : diffNumber / spendingsNumber + 1
        }
      />
    );
  }
  if (col.diff.isZero()) {
    return <TotalCostCellView cost={costString} color="white" barWidth={1} />;
  }
  if (col.diff.isPositive()) {
    return (
      <TotalCostCellView
        cost={costString}
        suffix={`+${diffSum}`}
        color="green"
        barWidth={divideWithFallbackToOne(
          spendingsNumber,
          diffNumber + spendingsNumber
        )}
      />
    );
  }

  const spentRatio = Math.min(
    divideWithFallbackToOne(-diffNumber, spendingsNumber),
    1
  );
  const offset =
    spendingsNumber === 0
      ? undefined
      : Math.max(diffNumber / spendingsNumber + 1, 0);

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

export default ThisMonthCellRenderer;
