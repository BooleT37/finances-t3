import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip } from "antd";
import React from "react";
import categoriesStore from "~/stores/categoriesStore";

interface Props {
  id: number;
  disabled?: boolean;
}

// eslint-disable-next-line mobx/missing-observer
const RemoveButtonRenderer: React.FC<Props> = ({ id, disabled }) => {
  const handleClick = React.useCallback(() => {
    Modal.confirm({
      content: "Вы уверены, что хотите удалить эту категорию?",
      onOk: () => categoriesStore.deleteCategory(id),
    });
  }, [id]);

  return (
    <Tooltip
      title={
        disabled
          ? "Это системная категория, ее нельзя удалить"
          : "Удалить категорию"
      }
    >
      <Button
        disabled={disabled}
        danger
        icon={<DeleteOutlined />}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

export default RemoveButtonRenderer;
