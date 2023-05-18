import { DeleteOutlined } from "@ant-design/icons";
import { TRPCClientError } from "@trpc/client";
import { Button, Modal, Tooltip } from "antd";
import React from "react";
import { dataStores } from "~/stores/dataStores";

interface Props {
  id: number;
  disabled?: boolean;
}

// eslint-disable-next-line mobx/missing-observer
const RemoveButtonRenderer: React.FC<Props> = ({ id, disabled }) => {
  const handleClick = React.useCallback(() => {
    Modal.confirm({
      content: "Вы уверены, что хотите удалить эту категорию?",
      onOk: async () => {
        try {
          await dataStores.categoriesStore.deleteCategory(id);
        } catch (e) {
          if (e instanceof TRPCClientError) {
            Modal.error({
              title: "Ошибка при удалении категории",
              content:
                "Возможно, вы пытаетесь удалить " +
                "категорию, к которой уже привязаны другие сущности " +
                "(расходы, подписки, прогнозы). Удалите эти сущности прежде, " +
                "чем удалять категорию.",
            });
          } else {
            throw e;
          }
        }
      },
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
