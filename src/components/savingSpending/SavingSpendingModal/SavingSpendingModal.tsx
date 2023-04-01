import { runInAction } from "mobx";
import { observer } from "mobx-react";
import CostsListModal from "~/components/CostsListModal";
import { type FormValues } from "~/components/CostsListModal/CostsListForm";
import savingSpendingStore from "~/stores/savingSpendingStore";
import { saveSavingSpending } from "./utils/saveSavingSpending";

interface Props {
  editedSpendingId: number;
  open: boolean;
  onClose(): void;
}

const SavingSpendingModal: React.FC<Props> = observer(
  function SavingSpendingModal({ open, editedSpendingId, onClose }) {
    const editedSpending =
      editedSpendingId === -1
        ? null
        : savingSpendingStore.getById(editedSpendingId);

    const handleFinish = (values: FormValues) => {
      runInAction(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
          await saveSavingSpending(
            editedSpendingId,
            values,
            editedSpending?.categories ?? []
          );
        })();
      });
      onClose();
    };

    const editingValue: FormValues | undefined =
      editedSpending === null
        ? undefined
        : {
            name: editedSpending.name,
            costs: editedSpending.categories.map((c) => ({
              comment: c.comment,
              sum: c.forecast,
              name: c.name,
              id: c.id,
            })),
          };

    return (
      <CostsListModal
        title={{
          editing: "Редактирование события",
          adding: "Добавление события",
        }}
        name={{
          placeholder: "Событие",
        }}
        open={open}
        includeComment
        sumPlaceholder="План"
        hideNameForSingleRow
        editingValue={editingValue}
        onClose={onClose}
        onFinish={handleFinish}
      />
    );
  }
);

export default SavingSpendingModal;
