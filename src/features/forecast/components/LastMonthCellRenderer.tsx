import React from "react";
import styled from "styled-components";
import type { MonthSpendings } from "~/features/forecast/types";
import { costToString } from "~/utils/costUtils";

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

const LastMonthCellRenderer: React.FC<Props> = ({ value: col }) => (
  <>
    {costToString(col.spendings)}
    <>
      {col.diff.isPositive() ? (
        <Green>+{costToString(col.diff)}</Green>
      ) : (
        <Red>{costToString(col.diff)}</Red>
      )}
    </>
  </>
);

export default LastMonthCellRenderer;
