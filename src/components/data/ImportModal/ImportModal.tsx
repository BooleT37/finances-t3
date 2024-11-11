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
import type { UploadChangeParam } from "antd/es/upload";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { observer } from "mobx-react";
import type {
  ParsedExpense,
  ParsedExpenseFromApi,
} from "~/models/ParsedExpense";
import { dataStores } from "~/stores/dataStores";
import vm from "./ImportModalViewModel";
import { NoParserTooltip } from "./NoParserTooltip";

const { Dragger } = Upload;

function parseExpenseFromApi(expense: ParsedExpenseFromApi): ParsedExpense {
  return {
    date: dayjs(expense.date),
    type: expense.type,
    description: expense.description,
    amount: new Decimal(expense.amount),
  };
}

export const ImportModal = observer(() => {
  const {
    visible,
    close,
    loading,
    setLoading,
    setParsedExpenses,
    selectedSource,
    selectedSourceId,
    setSelectedSourceId,
  } = vm;

  const handleUploadChange = ({ file }: UploadChangeParam<UploadFile>) => {
    if (file.status === "uploading") {
      setLoading(true);
    } else if (file.status === "done") {
      setLoading(false);
      close();
      setParsedExpenses(
        (file.response as ParsedExpenseFromApi[]).map(parseExpenseFromApi)
      );
    } else if (file.status === "error") {
      setLoading(false);
      message.error("Ошибка загрузки файла");
    }
  };

  const selectOptions = dataStores.sourcesStore.getAll().map((s) => ({
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
});
