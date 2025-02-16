import React from "react";
import type { CostCol } from "~/features/expense/Expense";
import { costToString } from "~/utils/costUtils";
import CostCellView from "./CostCellView";

interface Props {
  value: CostCol | null;
}

const CostCellRenderer: React.FC<Props> = ({ value: col }) => {
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
