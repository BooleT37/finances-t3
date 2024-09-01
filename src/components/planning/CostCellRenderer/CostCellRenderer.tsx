import { RightOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import { type ForecastTableItem } from "~/stores/ForecastStore/types";
import costToString from "~/utils/costToString";

import { Button, Space } from "antd";
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
  saveSum: (categoryId: number, sum: Decimal) => Promise<void>;
  transferPersonalExpense: (categoryId: number) => Promise<void>;
}

// eslint-disable-next-line mobx/missing-observer
const CostCellRenderer: React.FC<Props> = ({
  cost,
  subscriptions,
  data,
  saveSum,
  transferPersonalExpense,
}) => {
  const { categoryId } = data;
  const handleClick = useCallback(
    (totalCost: Decimal) => {
      // the "Total" row
      if (categoryId !== -1) {
        void saveSum(categoryId, totalCost);
      }
    },
    [categoryId, saveSum]
  );
  if (cost === null) {
    return <>-</>;
  }

  return (
    <Space>
      {costToString(cost)}
      {subscriptions.length > 0 && (
        <SubscriptionsTooltip items={subscriptions} onClick={handleClick} />
      )}
      {data.categoryType === "PERSONAL_EXPENSE" && (
        <Button
          size="small"
          shape="circle"
          title="Рассчитать персональные расходы"
          icon={<TransferPeIcon />}
          onClick={() => {
            void transferPersonalExpense(data.categoryId);
          }}
        />
      )}
    </Space>
  );
};

export default CostCellRenderer;
