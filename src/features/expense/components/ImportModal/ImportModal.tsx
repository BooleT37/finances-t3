import { InboxOutlined } from "@ant-design/icons";
import {
  message,
  Modal,
  Select,
  Space,
  Spin,
  Upload,
  type UploadFile,
} from "antd";
import type { UploadChangeParam } from "antd/lib/upload";
import type { ParsedExpenseFromApi } from "~/features/parsedExpense/api/types";
import { useSources } from "~/features/source/facets/allSources";
import { NoParserTooltip } from "./NoParserTooltip";
import { useImportModalContext } from "./importModalContext";

const { Dragger } = Upload;

export const ImportModal = () => {
  const {
    visible,
    close,
    loading,
    setLoading,
    setParsedExpenses,
    selectedSource,
    selectedSourceId,
    setSelectedSourceId,
  } = useImportModalContext();

  const { data: sources = [] } = useSources();

  const handleUploadChange = ({ file }: UploadChangeParam<UploadFile>) => {
    if (file.status === "uploading") {
      setLoading(true);
    } else if (file.status === "done") {
      setLoading(false);
      close();
      setParsedExpenses(file.response as ParsedExpenseFromApi[]);
    } else if (file.status === "error") {
      setLoading(false);
      void message.error("Ошибка загрузки файла");
    }
  };

  const selectOptions = sources.map((s) => ({
    value: s.id,
    label: s.name,
    disabled: s.parser === null,
  }));

  return (
    <Modal
      title="Импортировать расходы"
      open={visible}
      onClose={close}
      onCancel={close}
      footer={null}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space>
            Источник:
            <Select
              style={{ width: 150 }}
              value={selectedSourceId}
              onChange={setSelectedSourceId}
              options={selectOptions}
              placeholder="Выберите источник"
              optionRender={({ label }) => (
                <NoParserTooltip>{label}</NoParserTooltip>
              )}
            />
          </Space>
          <Dragger
            name="pdf-expenses"
            action={`api/parse-pdf-expenses?parser=${
              selectedSource?.parser ?? ""
            }`}
            method="POST"
            onChange={handleUploadChange}
            disabled={loading || !selectedSource}
            multiple={false}
            maxCount={1}
          >
            <InboxOutlined />
          </Dragger>
        </Space>
      </Spin>
    </Modal>
  );
};
