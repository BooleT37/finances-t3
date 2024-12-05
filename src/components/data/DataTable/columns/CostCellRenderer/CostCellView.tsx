import { MoneyCollectOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import type Decimal from "decimal.js";
import React from "react";
import { costToString } from "~/utils/costUtils";

interface Props {
  cost: string;
  isSubscription?: boolean;
  isUpcomingSubscription?: boolean;
  parentExpenseName?: string;
  costWithComponents?: Decimal;
}

// eslint-disable-next-line mobx/missing-observer
const CostCellView: React.FC<Props> = ({
  cost,
  isSubscription,
  isUpcomingSubscription,
  parentExpenseName,
  costWithComponents,
}) => {
  const costElement = (
    <div>
      {cost}&nbsp;
      {costWithComponents !== undefined && (
        <span style={{ color: "gray" }}>
          <Tooltip title="Стоимость включая все составляющие">
            ({costToString(costWithComponents)})
          </Tooltip>
        </span>
      )}
      {isSubscription && (
        <>
          &nbsp;
          <Tooltip
            title={isUpcomingSubscription ? "Предстоящая подписка" : "Подписка"}
          >
            <MoneyCollectOutlined style={{ color: "gray" }} />
          </Tooltip>
        </>
      )}
      {parentExpenseName !== undefined && (
        <>
          &nbsp;
          <Tooltip
            title={
              parentExpenseName
                ? `Составляющая расхода "${parentExpenseName}"`
                : "Составляющая расхода"
            }
          >
            <UnorderedListOutlined style={{ color: "gray" }} />
          </Tooltip>
        </>
      )}
    </div>
  );

  return <div>{costElement}</div>;
};

export default CostCellView;
