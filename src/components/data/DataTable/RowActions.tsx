import { EditFilled } from "@ant-design/icons";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { Button, Modal, Space } from "antd";
import { useCallback } from "react";
import { dataStores } from "~/stores/dataStores";
import expenseModalViewModel from "../ExpenseModal/expenseModalViewModel";

interface Props {
  parentExpenseId: number | null;
  id: number;
}

export const RowActions: React.FC<Props> =
  // eslint-disable-next-line mobx/missing-observer
  ({ id, parentExpenseId }) => {
    const handleEditClick = useCallback(() => {
      expenseModalViewModel.open(parentExpenseId ?? id);
      if (parentExpenseId !== null) {
        expenseModalViewModel.setComponentsModalOpen(true);
        expenseModalViewModel.highlightComponentInModal(id);
      }
    }, [id, parentExpenseId]);

    const handleDeleteClick = useCallback(() => {
      Modal.confirm({
        content: `Вы уверены, что хотите удалить этот ${
          parentExpenseId === null ? "расход" : "компонент расхода"
        }?`,
        onOk: async () => {
          if (parentExpenseId === null) {
            await dataStores.expenseStore.delete(id);
          } else {
            await dataStores.expenseStore.deleteComponent(id, parentExpenseId);
          }
        },
      });
    }, [id, parentExpenseId]);
    return (
      <Space>
        <Button key="edit" icon={<EditFilled />} onClick={handleEditClick} />
        <Button
          key="delete"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteClick}
        />
      </Space>
    );
  };
