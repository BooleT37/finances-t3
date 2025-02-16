import { Tooltip } from "antd";
import styled from "styled-components";
import { DATE_FORMAT } from "~/utils/constants";
import { costToString } from "~/utils/costUtils";

import { useLastExpensesPerSource } from "~/features/expense/facets/lastExpenses";
import styles from "./SourceLastExpenses.module.css";

interface Props {
  sourceId: number;
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`;

const SourceLastExpenses: React.FC<Props> = ({ sourceId }) => {
  const lastExpenses = useLastExpensesPerSource()[sourceId];
  if (!lastExpenses?.[0]) {
    return null;
  }
  const expensesDate =
    lastExpenses.length === 0
      ? "Никогда"
      : lastExpenses[0].calculatedActualDate.format(DATE_FORMAT);
  const tooltipContent =
    lastExpenses.length === 0 ? null : (
      <>
        {lastExpenses.map((expense) => (
          <div key={expense.id}>
            <Row>
              <span>
                {expense.category.name}
                {expense.name && <span> - {expense.name}</span>}
              </span>
              {expense.cost !== null && (
                <span>{costToString(expense.cost)}</span>
              )}
            </Row>
          </div>
        ))}
      </>
    );
  return (
    <Tooltip
      classNames={{ root: styles["source-last-expenses"] }}
      title={tooltipContent}
    >
      <div>Последняя запись: {expensesDate}</div>
    </Tooltip>
  );
};

export default SourceLastExpenses;
