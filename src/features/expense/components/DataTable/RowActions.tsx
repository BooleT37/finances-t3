import { EditFilled } from "@ant-design/icons";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { Button, Modal, Space } from "antd";
import { useCallback } from "react";
import {
  useDeleteExpense,
  useDeleteExpenseComponent,
} from "~/features/expense/api/expensesApi";
import { useExpenseModalContext } from "../ExpenseModal/expenseModalContext";

interface Props {
  parentExpenseId: number | null;
  id: number;
}

export const RowActions: React.FC<Props> = ({ id, parentExpenseId }) => {
  const expenseModalContext = useExpenseModalContext();
  const deleteExpense = useDeleteExpense();
  const deleteExpenseComponent = useDeleteExpenseComponent();
  const handleEditClick = useCallback(() => {
    expenseModalContext.open(parentExpenseId ?? id);
    if (parentExpenseId !== null) {
      expenseModalContext.setComponentsModalOpen(true);
      expenseModalContext.highlightComponentInModal(id);
    }
  }, [expenseModalContext, id, parentExpenseId]);

  const handleDeleteClick = useCallback(() => {
    Modal.confirm({
      content: `Вы уверены, что хотите удалить этот ${
        parentExpenseId === null ? "расход" : "компонент расхода"
      }?`,
      onOk: async () => {
        if (parentExpenseId === null) {
          deleteExpense.mutate(id);
        } else {
          deleteExpenseComponent.mutate({
            id,
            expenseId: parentExpenseId,
          });
        }
      },
    });
  }, [deleteExpense, deleteExpenseComponent, id, parentExpenseId]);
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
