import { Modal } from "antd";
import { useRef } from "react";
import CostsListForm, {
  type CostsListFormInterface,
  type FormValues,
} from "./CostsListForm";

interface Props {
  open: boolean;
  title: {
    adding: string;
    editing: string;
  };
  includeComment?: boolean;
  editingValue?: FormValues;
  name?: {
    placeholder: string;
  };
  sumPlaceholder?: string;
  hideNameForSingleRow?: boolean;
  onClose(): void;
  onFinish(values: FormValues): void;
}

// eslint-disable-next-line mobx/missing-observer
const CostsListModal: React.FC<Props> = (props) => {
  const {
    open,
    title,
    includeComment,
    editingValue,
    name,
    sumPlaceholder,
    hideNameForSingleRow,
  } = props;

  const form = useRef<CostsListFormInterface>(null);

  const handleOk = () => {
    form.current?.submit();
  };

  return (
    <Modal
      title={editingValue ? title.editing : title.adding}
      open={open}
      onCancel={() => props.onClose()}
      okText={editingValue ? "Сохранить" : "Добавить"}
      onOk={handleOk}
      destroyOnClose
    >
      <CostsListForm
        ref={form}
        includeComment={includeComment}
        editingValue={editingValue}
        name={name}
        sumPlaceholder={sumPlaceholder}
        hideNameForSingleRow={hideNameForSingleRow}
        onFinish={(values) => props.onFinish(values)}
      />
    </Modal>
  );
};

export default CostsListModal;
