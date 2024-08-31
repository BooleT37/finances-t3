import { Tooltip } from "antd";
import { observer } from "mobx-react";
import styled from "styled-components";
import { dataStores } from "~/stores/dataStores";
import { DATE_FORMAT } from "~/utils/constants";
import costToString from "~/utils/costToString";

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

const SourceLastExpenses: React.FC<Props> = observer(
  function SourceLastExpenses({ sourceId }) {
    const lastExpenses =
      dataStores.expenseStore.lastExpensesPerSource[sourceId];
    if (!lastExpenses || !lastExpenses[0]) {
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
        overlayClassName={styles["source-last-expenses"]}
        title={tooltipContent}
      >
        <div>Последняя запись: {expensesDate}</div>
      </Tooltip>
    );
  }
);

export default SourceLastExpenses;
