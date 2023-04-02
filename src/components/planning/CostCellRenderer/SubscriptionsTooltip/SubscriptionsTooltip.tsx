import { MoneyCollectOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { sum } from "lodash";
import React, { useCallback } from "react";
import { type ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";
import costToString from "~/utils/costToString";
import roundCost from "~/utils/roundCost";
import { List, TooltipContainer } from "./SubscriptionsTooltip.styled";

interface Props {
  items: ForecastSubscriptionsItem[];
  onClick(totalCost: number): void;
}

// eslint-disable-next-line mobx/missing-observer
const SubscriptionsTooltip: React.FC<Props> = ({ items, onClick }) => {
  const total = roundCost(
    sum(items.map((item) => parseFloat(item.cost.toString())))
  );

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
        ({total} <MoneyCollectOutlined onClick={handleClick} />)
      </TooltipContainer>
    </Tooltip>
  );
};

export default SubscriptionsTooltip;
