import type { ICellRendererParams } from "ag-grid-community";
import { useCallback } from "react";
import {
  type ForecastSum,
  type ForecastTableItem,
} from "~/stores/ForecastStore/types";
import costToString from "~/utils/costToString";
import type { ForecastMainTableContext } from "../PlanningScreen";

import type Decimal from "decimal.js";
import SubscriptionsTooltip from "./SubscriptionsTooltip/SubscriptionsTooltip";

type Props = Omit<ICellRendererParams, "value" | "data" | "context"> & {
  value: ForecastSum;
  data: ForecastTableItem;
  context: ForecastMainTableContext;
};

// eslint-disable-next-line mobx/missing-observer
const CostCellRenderer: React.FC<Props> = ({ value, data, context }) => {
  const handleClick = useCallback(
    (totalCost: Decimal) => {
      // the "Total" row
      if (data.categoryId !== -1) {
        context.setForecastSum(data.categoryId, totalCost);
      }
    },
    [context, data.categoryId]
  );
  if (value.value === null) {
    return <>-</>;
  }

  return (
    <>
      {costToString(value.value)}
      {value.subscriptions.length > 0 && (
        <SubscriptionsTooltip
          items={value.subscriptions}
          onClick={handleClick}
        />
      )}
    </>
  );
};

export default CostCellRenderer;
