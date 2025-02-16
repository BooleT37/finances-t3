import { EditOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useCallback } from "react";
import { useCategoryModalContext } from "./CategoryEditModal/categoryModalContext";

interface Props {
  isIncome: boolean;
  id: number;
}

const EditButtonRenderer: React.FC<Props> = ({ id, isIncome }) => {
  const { open } = useCategoryModalContext();
  const handleClick = useCallback(() => {
    open({ isIncome, expenseId: id });
  }, [id, isIncome, open]);

  return (
    <Tooltip title="Редактировать">
      <Button icon={<EditOutlined />} onClick={handleClick} />
    </Tooltip>
  );
};

export default EditButtonRenderer;
