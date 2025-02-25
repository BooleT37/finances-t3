import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Switch, Table, Tooltip } from "antd";
import type { ColumnType, TableProps } from "antd/lib/table";
import type Decimal from "decimal.js";
import type { FC } from "react";
import styled from "styled-components";
import type SavingSpending from "~/features/savingSpending/SavingSpending";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";
import { useSpendingCategoriesTableRecords } from "./useSpendingCategoriesTableRecords";
interface Props {
  spending: SavingSpending;
  onEditClick(): void;
  onDeleteClick(): void;
}

export interface RecordType {
  id: string;
  name: string;
  forecast: Decimal;
  expenses: Decimal;
}

const tableColumnsForSingleCategory: ColumnType<RecordType>[] = [
  {
    title: "План",
    dataIndex: "forecast",
    key: "forecast",
    render: (value: Decimal) => costToString(value),
  },
  {
    title: "Факт",
    dataIndex: "expenses",
    key: "expenses",
    render: (value: Decimal) => costToString(value),
  },
];

const tableColumns: ColumnType<RecordType>[] = [
  {
    title: "Категория",
    dataIndex: "name",
    key: "name",
  },
  ...tableColumnsForSingleCategory,
];

const TableStyled = styled(Table)`
  .ant-table-thead > tr > th {
    background: white;
  }

  .ant-table-placeholder {
    .ant-empty {
      margin: 0;
    }
    .ant-empty-image {
      display: none;
    }
  }
`;

const SavingSpendingCard: React.FC<Props> = ({
  spending,
  onEditClick,
  onDeleteClick,
}) => {
  const title = (
    <Row>
      <Col flex="auto">{spending.name}</Col>
      <Col flex="0">
        <Tooltip title={spending.completed ? "Завершено" : "Активно"}>
          <Switch
            checked={!spending.completed}
            onChange={(checked) => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              spending.toggle(!checked);
            }}
          />
        </Tooltip>
      </Col>
      <Col flex="0">
        <Tooltip title="Редактировать событие">
          <Button type="link" icon={<EditOutlined />} onClick={onEditClick} />
        </Tooltip>
      </Col>
      <Col flex="0">
        <Tooltip title="Удалить событие">
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={onDeleteClick}
          />
        </Tooltip>
      </Col>
    </Row>
  );

  const data = useSpendingCategoriesTableRecords(spending);
  return (
    <Card title={title}>
      <TableStyled<FC<TableProps<RecordType>>>
        columns={
          spending.categories.length > 1
            ? tableColumns
            : tableColumnsForSingleCategory
        }
        dataSource={data}
        pagination={false}
        rowKey="id"
        size="small"
        summary={(pageData) => {
          if (pageData.length < 2) {
            return null;
          }
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Всего:</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {costToString(decimalSum(...pageData.map((r) => r.forecast)))}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {costToString(decimalSum(...pageData.map((r) => r.expenses)))}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </Card>
  );
};

export default SavingSpendingCard;
