import React from "react";
import { type CostCol } from "~/models/Expense";
import costToString from "~/utils/costToString";
import CostCellView from "./CostCellView";

interface Props {
  value: CostCol | null;
  isIncome: boolean;
}

// eslint-disable-next-line mobx/missing-observer
const CostCellRenderer: React.FC<Props> = ({ value: col, isIncome }) => {
  if (!col) {
    return null;
  }
  const costString = costToString(col.value);
  return (
    <CostCellView
      cost={costString}
      isSubscription={col.isSubscription}
      isUpcomingSubscription={col.isUpcomingSubscription}
      parentExpenseName={col.parentExpenseName}
      costWithComponents={col.costWithComponents}
    />
  );
};

export default CostCellRenderer;
