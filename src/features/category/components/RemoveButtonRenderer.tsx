import { DeleteOutlined } from "@ant-design/icons";
import { TRPCClientError } from "@trpc/client";
import { Button, Modal, Tooltip } from "antd";
import React from "react";
import { useDeleteCategory } from "~/features/category/api/categoriesApi";

interface Props {
  id: number;
  disabled?: boolean;
}

const RemoveButtonRenderer: React.FC<Props> = ({ id, disabled }) => {
  const deleteCategory = useDeleteCategory();
  const handleClick = React.useCallback(() => {
    Modal.confirm({
      content: "Вы уверены, что хотите удалить эту категорию?",
      onOk: async () => {
        try {
          await deleteCategory.mutateAsync(id);
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
        disabled ? "Это системная категория, ее нельзя удалить" : "Удалить"
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
