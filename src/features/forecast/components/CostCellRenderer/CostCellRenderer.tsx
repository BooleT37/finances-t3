import { useCallback } from "react";
import { costToString } from "~/utils/costUtils";

import { Space, Tooltip } from "antd";
import type Decimal from "decimal.js";
import type { ForecastTableItem } from "~/features/forecast/types";
import type { ForecastSubscriptionsItem } from "~/features/forecast/types/forecastTypes";
import SubscriptionsTooltip from "./SubscriptionsTooltip/SubscriptionsTooltip";

interface Props {
  cost: Decimal | null;
  subscriptions: ForecastSubscriptionsItem[];
  data: ForecastTableItem;
  parentData: ForecastTableItem | null;
  showSubcategoriesTooltip: boolean;
  saveSum: (
    categoryId: number,
    subcategoryId: number | null,
    sum: Decimal
  ) => Promise<void>;
}

const CostCellRenderer: React.FC<Props> = ({
  cost,
  subscriptions,
  data,
  showSubcategoriesTooltip,
  saveSum,
}) => {
  const { categoryId, subcategoryId } = data;
  const handleClick = useCallback(
    async (totalCost: Decimal) => {
      if (categoryId === null) {
        return;
      }
      void saveSum(categoryId, subcategoryId, totalCost);
    },
    [categoryId, saveSum, subcategoryId]
  );
  if (cost === null) {
    return <>-</>;
  }

  return (
    <Tooltip
      title={
        showSubcategoriesTooltip
          ? "Сумма рассчитана как сумма всех подкатегорий"
          : undefined
      }
    >
      <Space>
        {costToString(cost)}
        {subscriptions.length > 0 && (
          <SubscriptionsTooltip items={subscriptions} onClick={handleClick} />
        )}
      </Space>
    </Tooltip>
  );
};

export default CostCellRenderer;
