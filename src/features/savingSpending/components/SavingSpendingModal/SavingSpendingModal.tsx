import { useMemo } from "react";
import CostsListModal from "~/components/CostsListModal";
import { type FormValues } from "~/components/CostsListModal/CostsListForm";
import { useSavingSpendingById } from "~/features/savingSpending/facets/savingSpendingById";
import { useSaveSavingSpending } from "./utils/saveSavingSpending";
import { savingSpendingToFormValues } from "./utils/savingSpendingToFormValues";

interface Props {
  editedSpendingId: number;
  open: boolean;
  onClose(): void;
}

const SavingSpendingModal: React.FC<Props> = ({
  open,
  editedSpendingId,
  onClose,
}) => {
  const savingSpendingById = useSavingSpendingById();
  const saveSavingSpending = useSaveSavingSpending();
  const editedSpending =
    !savingSpendingById.loaded || editedSpendingId === -1
      ? null
      : savingSpendingById.getSavingSpendingById(editedSpendingId);

  const handleFinish = (values: FormValues) => {
    saveSavingSpending(
      editedSpendingId,
      values,
      editedSpending?.categories ?? []
    );
    onClose();
  };

  const editingValue: FormValues | undefined = useMemo(
    () =>
      editedSpending === null
        ? undefined
        : savingSpendingToFormValues(editedSpending),
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
      loading={!savingSpendingById.loaded}
      onClose={onClose}
      onFinish={handleFinish}
    />
  );
};

export default SavingSpendingModal;
