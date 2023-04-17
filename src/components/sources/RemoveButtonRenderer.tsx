import { DeleteOutlined } from "@ant-design/icons";
import { TRPCClientError } from "@trpc/client";
import { Button, Modal, Tooltip } from "antd";
import React from "react";
import sourcesStore from "~/stores/sourcesStore";

interface Props {
  id: number;
}

// eslint-disable-next-line mobx/missing-observer
const RemoveButtonRenderer: React.FC<Props> = ({ id }) => {
  const handleClick = React.useCallback(() => {
    Modal.confirm({
      content: "Вы уверены, что хотите удалить этот источник?",
      onOk: async () => {
        try {
          await sourcesStore.deleteSource(id);
        } catch (e) {
          if (e instanceof TRPCClientError) {
            Modal.error({
              title: "Ошибка при удалении источника",
              content: e.message,
            });
          } else {
            throw e;
          }
        }
      },
    });
  }, [id]);

  return (
    <Tooltip title="Удалить источник">
      <Button danger icon={<DeleteOutlined />} onClick={handleClick} />
    </Tooltip>
  );
};

export default RemoveButtonRenderer;
