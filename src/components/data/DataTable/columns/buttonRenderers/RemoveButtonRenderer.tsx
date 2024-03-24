import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React from "react";
import { dataStores } from "~/stores/dataStores";

interface Props {
  id: number;
  onClick(): void;
}

// eslint-disable-next-line mobx/missing-observer
const RemoveButtonRenderer: React.FC<Props> = ({ id, onClick }) => {
  const handleClick = React.useCallback(() => {
    Modal.confirm({
      content: "Вы уверены, что хотите удалить этот расход?",
      onOk: async () => {
        await dataStores.expenseStore.delete(id);
        onClick();
      },
    });
  }, [id, onClick]);

  return <Button danger icon={<DeleteOutlined />} onClick={handleClick} />;
};

export default RemoveButtonRenderer;
