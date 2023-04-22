import { runInAction } from "mobx";
import { useMemo } from "react";
import CostsListModal from "~/components/CostsListModal";
import { type FormValues } from "~/components/CostsListModal/CostsListForm";
import savingSpendingStore from "~/stores/savingSpendingStore";
import { savingSpendingModalViewModel } from "./SavingSpendingModalViewModel";
import { saveSavingSpending } from "./utils/saveSavingSpending";

interface Props {
  editedSpendingId: number;
  open: boolean;
  onClose(): void;
}

// eslint-disable-next-line mobx/missing-observer
const SavingSpendingModal: React.FC<Props> = ({
  open,
  editedSpendingId,
  onClose,
}) => {
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

  const editingValue: FormValues | undefined = useMemo(
    () =>
      editedSpending === null
        ? undefined
        : savingSpendingModalViewModel.savingSpendingToFormValues(
            editedSpending
          ),
    [editedSpending]
  );

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
};

export default SavingSpendingModal;
