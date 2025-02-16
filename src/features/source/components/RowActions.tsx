import { DeleteOutlined } from "@ant-design/icons";
import { TRPCClientError } from "@trpc/client";
import { Button, Modal, Tooltip } from "antd";
import { useCallback } from "react";
import { useDeleteSource } from "~/features/source/api/sourcesApi";

interface Props {
  id: number;
}

export const RowActions: React.FC<Props> = ({ id }) => {
  const deleteSource = useDeleteSource();
  const handleClick = useCallback(() => {
    Modal.confirm({
      content: "Вы уверены, что хотите удалить этот источник?",
      onOk: async () => {
        try {
          await deleteSource.mutateAsync(id);
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
  }, [deleteSource, id]);

  return (
    <Tooltip title="Удалить источник">
      <Button danger icon={<DeleteOutlined />} onClick={handleClick} />
    </Tooltip>
  );
};
