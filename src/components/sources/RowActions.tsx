import { DeleteOutlined } from "@ant-design/icons";
import { TRPCClientError } from "@trpc/client";
import { Button, Modal, Tooltip } from "antd";
import { useCallback } from "react";
import { dataStores } from "~/stores/dataStores";

interface Props {
  id: number;
}

export const RowActions: React.FC<Props> =
  // eslint-disable-next-line mobx/missing-observer
  ({ id }) => {
    const handleClick = useCallback(() => {
      Modal.confirm({
        content: "Вы уверены, что хотите удалить этот источник?",
        onOk: async () => {
          try {
            await dataStores.sourcesStore.deleteSource(id);
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
