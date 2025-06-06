import { Tooltip } from "antd";
import React from "react";
import styled from "styled-components";

const DiffNode = styled("span")<{ color: string }>`
  font-size: 12px;
  color: ${(props) => props.color};
`;

const BarContainer = styled.div`
  position: relative;
  bottom: 0;
  border: 1px solid gray;
  height: 4px;
  width: 60px;
`;

const Bar = styled("div")<{ color: string; width: number; offset?: number }>`
  height: 2px;
  background-color: ${(props) => props.color};
  width: ${(props) => props.width * 100}%;
  margin-left: ${(props) =>
    props.offset !== undefined ? `${props.offset * 100}%` : 0};
`;

interface Props {
  cost: string;
  suffix: string;
  color: "red" | "orange" | "green";
  barWidth: number;
  barOffset?: number;
  tooltip?: React.ReactNode;
}

const TotalCostCellView: React.FC<Props> = (props) => {
  const { cost, suffix, color, barOffset = 0, barWidth, tooltip } = props;

  return (
    <div>
      <div>
        {cost}&nbsp;
        <Tooltip title={tooltip}>
          <DiffNode color={color}>{suffix}</DiffNode>
        </Tooltip>
      </div>
      <BarContainer>
        <Bar color={color} width={barWidth} offset={barOffset} />
      </BarContainer>
    </div>
  );
};

export default TotalCostCellView;
