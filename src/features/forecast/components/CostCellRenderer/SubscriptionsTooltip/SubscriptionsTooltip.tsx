import { MoneyCollectOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useCallback } from "react";
import { type ForecastSubscriptionsItem } from "~/features/forecast/types/forecastTypes";
import { costToString } from "~/utils/costUtils";

import type Decimal from "decimal.js";
import { decimalSum } from "~/utils/decimalSum";
import { List, TooltipContainer } from "./SubscriptionsTooltip.styled";

interface Props {
  items: ForecastSubscriptionsItem[];
  onClick(totalCost: Decimal): void;
}

const SubscriptionsTooltip: React.FC<Props> = ({ items, onClick }) => {
  const total = decimalSum(...items.map((item) => item.cost));
  const handleClick = useCallback(() => {
    onClick(total);
  }, [onClick, total]);

  const tooltipText = React.useMemo(() => {
    if (items.length === 1 && items[0] !== undefined) {
      return (
        <>
          {costToString(total)} из подписок ({items[0].name})
        </>
      );
    } else {
      return (
        <>
          {costToString(total)} из подписок:
          <List>
            {items.map((item) => (
              <li key={item.name}>
                {costToString(item.cost)}
                {"\u00A0"}
                {item.name}
              </li>
            ))}
          </List>
        </>
      );
    }
  }, [items, total]);

  return (
    <Tooltip title={tooltipText}>
      <TooltipContainer>
        ({costToString(total)} <MoneyCollectOutlined onClick={handleClick} />)
      </TooltipContainer>
    </Tooltip>
  );
};

export default SubscriptionsTooltip;
