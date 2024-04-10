import { MoneyCollectOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import styled from "styled-components";

interface Props {
  cost: string;
  personalExpStr?: string;
  isSubscription?: boolean;
  isUpcomingSubscription?: boolean;
  parentExpenseName?: string;
  costWithComponents?: number;
}

const ShiftedCost = styled.div`
  position: relative;
  bottom: 5px;
`;

const PersonalExp = styled.div`
  position: relative;
  bottom: 30px;
  font-size: 10px;
  font-style: italic;
  color: gray;
`;

// eslint-disable-next-line mobx/missing-observer
const CostCellView: React.FC<Props> = ({
  cost,
  personalExpStr,
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
            ({costWithComponents})
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

  return (
    <div>
      {personalExpStr ? (
        <>
          <ShiftedCost>{costElement}</ShiftedCost>
          <PersonalExp>+{personalExpStr}</PersonalExp>
        </>
      ) : (
        <div>{costElement}</div>
      )}
    </div>
  );
};

export default CostCellView;
