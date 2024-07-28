import React from "react";
import styled from "styled-components";
import { type MonthSpendings } from "~/stores/ForecastStore/types";
import costToString from "~/utils/costToString";

interface Props {
  value: MonthSpendings;
}

const Diff = styled.div`
  position: absolute;
  bottom: 0;
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
      {costToString(col.spendings)}
      {col.diff.isPositive() ? (
        <>
          {col.diff.isPositive() ? (
            <Green>+{costToString(col.diff)}</Green>
          ) : (
            <Red>{costToString(col.diff)}</Red>
          )}
        </>
      ) : null}
    </>
  );
};

export default LastMonthCellRenderer;
