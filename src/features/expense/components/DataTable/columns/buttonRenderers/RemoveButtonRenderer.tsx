import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React from "react";
import { useDeleteExpense } from "~/features/expense/api/expensesApi";

interface Props {
  id: number;
  onClick(): void;
}

const RemoveButtonRenderer: React.FC<Props> = ({ id, onClick }) => {
  const deleteExpense = useDeleteExpense();
  const handleClick = React.useCallback(() => {
    Modal.confirm({
      content: "Вы уверены, что хотите удалить этот расход?",
      onOk: async () => {
        deleteExpense.mutate(id, {
          onSuccess: () => {
            onClick();
          },
        });
      },
    });
  }, [deleteExpense, id, onClick]);

  return <Button danger icon={<DeleteOutlined />} onClick={handleClick} />;
};

export default RemoveButtonRenderer;
