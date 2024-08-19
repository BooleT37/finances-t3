import { EditOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React from "react";
import categoryModalViewModel from "./CategoryEditModal/categoryModalViewModel";

interface Props {
  isIncome: boolean;
  id: number;
}

// eslint-disable-next-line mobx/missing-observer
const EditButtonRenderer: React.FC<Props> = ({ id, isIncome }) => {
  const { open } = categoryModalViewModel;
  const handleClick = React.useCallback(() => {
    open({ isIncome, expenseId: id });
  }, [id, isIncome, open]);

  return (
    <Tooltip title="Редактировать">
      <Button icon={<EditOutlined />} onClick={handleClick} />
    </Tooltip>
  );
};

export default EditButtonRenderer;
