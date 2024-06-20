import React from "react";
import styled from "styled-components";
import { type MonthSpendings } from "~/stores/ForecastStore/types";
import costToString from "~/utils/costToString";

interface Props {
  value: MonthSpendings;
}

const WithOffset = styled("div")<{ offset: number }>`
  position: ${(props) => (props.offset ? "relative" : "static")};
  bottom: ${(props) => (props.offset ? `${props.offset}px` : "auto")};
`;

const Diff = styled(WithOffset)`
  font-size: 10px;
`;

const Red = styled(Diff)`
  color: red;
`;

const Green = styled(Diff)`
  color: green;
`;

// eslint-disable-next-line mobx/missing-observer
const LastMonthCellRenderer: React.FC<Props> = ({ value: col }) => {
  return (
    <>
      <WithOffset offset={col.diff.isPositive() ? 3 : 0}>
        {costToString(col.spendings)}
      </WithOffset>
      {col.diff.isPositive() ? (
        <>
          {col.diff.isPositive() ? (
            <Green offset={29}>+{costToString(col.diff)}</Green>
          ) : (
            <Red offset={29}>{costToString(col.diff)}</Red>
          )}
        </>
      ) : null}
    </>
  );
};

export default LastMonthCellRenderer;
