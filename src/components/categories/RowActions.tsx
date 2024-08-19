import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { TRPCClientError } from "@trpc/client";
import { Button, Modal, Space, Tooltip } from "antd";
import { useCallback } from "react";
import { dataStores } from "~/stores/dataStores";
import categoryModalViewModel from "./CategoryEditModal/categoryModalViewModel";

interface Props {
  id: number;
  isIncome: boolean;
  deletingDisabled: boolean;
}

export const RowActions: React.FC<Props> =
  // eslint-disable-next-line mobx/missing-observer
  ({ id, isIncome, deletingDisabled }) => {
    const { open } = categoryModalViewModel;
    const handleEditClick = useCallback(() => {
      open({ isIncome, expenseId: id });
    }, [id, isIncome, open]);

    const handleClick = useCallback(() => {
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
      <Space>
        <Tooltip title="Редактировать">
          <Button icon={<EditOutlined />} onClick={handleEditClick} />
        </Tooltip>
        <Tooltip
          title={
            deletingDisabled
              ? "Это системная категория, ее нельзя удалить"
              : "Удалить"
          }
        >
          <Button
            disabled={deletingDisabled}
            danger
            icon={<DeleteOutlined />}
            onClick={handleClick}
          />
        </Tooltip>
      </Space>
    );
  };
