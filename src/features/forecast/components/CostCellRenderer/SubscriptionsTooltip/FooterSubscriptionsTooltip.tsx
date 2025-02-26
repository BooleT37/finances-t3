import { MoneyCollectOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Decimal from "decimal.js";
import React, { useCallback, useMemo } from "react";
import { type ForecastSubscriptionsItem } from "~/features/forecast/types/forecastTypes";
import { costToString } from "~/utils/costUtils";

import { decimalSum } from "~/utils/decimalSum";
import { List, TooltipContainer } from "./SubscriptionsTooltip.styled";

interface Props {
  items: ForecastSubscriptionsItem[];
  onClick(totalCost: Decimal): void;
}

type GroupedSubscriptions = Record<
  string,
  {
    items: ForecastSubscriptionsItem[];
    total: Decimal;
  }
>;

const FooterSubscriptionsTooltip: React.FC<Props> = ({ items, onClick }) => {
  const total = decimalSum(...items.map((item) => item.cost));

  const handleClick = useCallback(() => {
    onClick(total);
  }, [onClick, total]);

  const groupedSubscriptions = useMemo(() => {
    const grouped: GroupedSubscriptions = {};

    items.forEach((item) => {
      const sourceName = item.sourceName ?? "Без источника";

      if (!grouped[sourceName]) {
        grouped[sourceName] = {
          items: [],
          total: new Decimal(0),
        };
      }

      grouped[sourceName].items.push(item);
      grouped[sourceName].total = grouped[sourceName].total.plus(item.cost);
    });

    return grouped;
  }, [items]);

  const tooltipText = useMemo(() => {
    if (items.length === 0) {
      return null;
    }

    const sourceNames = Object.keys(groupedSubscriptions);

    if (sourceNames.length === 1 && sourceNames[0] !== undefined) {
      const sourceName = sourceNames[0];
      const group = groupedSubscriptions[sourceName];

      if (group && group.items.length === 1 && group.items[0] !== undefined) {
        return (
          <>
            {costToString(total)} из подписок ({group.items[0].name})
          </>
        );
      }
    }

    return (
      <>
        {costToString(total)} из подписок:
        <List>
          {sourceNames.map((sourceName) => {
            const group = groupedSubscriptions[sourceName];
            if (!group) return null;

            return (
              <li key={sourceName}>
                <strong>
                  {sourceName}: {costToString(group.total)}
                </strong>
                <List>
                  {group.items.map((item) => (
                    <li key={item.name}>
                      {costToString(item.cost)}
                      {"\u00A0"}
                      {item.name}
                    </li>
                  ))}
                </List>
              </li>
            );
          })}
        </List>
      </>
    );
  }, [items, total, groupedSubscriptions]);

  if (!tooltipText) {
    return null;
  }

  return (
    <Tooltip title={tooltipText}>
      <TooltipContainer>
        ({costToString(total)} <MoneyCollectOutlined onClick={handleClick} />)
      </TooltipContainer>
    </Tooltip>
  );
};

export default FooterSubscriptionsTooltip;
