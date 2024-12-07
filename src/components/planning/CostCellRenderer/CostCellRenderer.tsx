import { RightOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import { type ForecastTableItem } from "~/stores/ForecastStore/types";
import { costToString } from "~/utils/costUtils";

import { Space, Tooltip } from "antd";
import type Decimal from "decimal.js";
import styled from "styled-components";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";
import SubscriptionsTooltip from "./SubscriptionsTooltip/SubscriptionsTooltip";

const TransferPeIcon = styled(RightOutlined)`
  font-size: 12px;
  color: gray;
  cursor: pointer;
`;

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

// eslint-disable-next-line mobx/missing-observer
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
