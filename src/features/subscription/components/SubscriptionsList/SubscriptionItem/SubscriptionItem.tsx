import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip } from "antd";
import React from "react";
import styled from "styled-components";
import {
  SubscriptionCost,
  SubscriptionDate,
  SubscriptionName,
} from "./SubscriptionItem.styled";

interface Props {
  id: number;
  name: string;
  costString: string;
  nextDate: string;
  active: boolean;
  onEdit(id: number): void;
  onDelete(id: number): void;
}

const Container = styled.div<{ $active: boolean }>`
  color: ${(props) => (props.$active ? undefined : "gray")};
`;

const SubscriptionsItem: React.FC<Props> = function SubscriptionsItem(props) {
  const handleDelete = () => {
    Modal.confirm({
      title: "Удаление подписки",
      content: "Вы уверены, что хотите удалить эту подписку?",
      okText: "Удалить",
      cancelText: "Отмена",
      onOk: () => {
        props.onDelete(props.id);
      },
    });
  };

  return (
    <Container $active={props.active}>
      <SubscriptionName>{props.name}</SubscriptionName>
      <SubscriptionCost>{props.costString}</SubscriptionCost>
      <Tooltip title="Следующая дата списания">
        <SubscriptionDate>{props.nextDate}</SubscriptionDate>
      </Tooltip>
      <Tooltip title="Редактировать">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => {
            props.onEdit(props.id);
          }}
        />
      </Tooltip>
      <Tooltip title="Удалить">
        <Button type="text" icon={<DeleteOutlined />} onClick={handleDelete} />
      </Tooltip>
    </Container>
  );
};

export default SubscriptionsItem;
