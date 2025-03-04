import { Button, Checkbox, Form, Modal } from "antd";
import { type Dayjs } from "dayjs";
import React, { useState } from "react";
import styled from "styled-components";
import type { ExpenseFromApi } from "../../api/types";
import { useExpenseModalContext } from "./expenseModalContext";
import ExpenseModalForm from "./ExpenseModalForm";
import { expenseToFormValues } from "./expenseToFormValues";
import { type FormValues } from "./models";

const ModalStyled = styled(Modal)`
  .ant-modal-footer {
    white-space: nowrap;
  }
`;

interface Props {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onSubmit(expense: ExpenseFromApi): void;
}

const ExpenseModal: React.FC<Props> = ({
  startDate,
  endDate,
  onSubmit,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();

  const { visible, isNewExpense, lastExpense, close, addMore, setAddMore } =
    useExpenseModalContext();

  const handleInsertPreviousClick = () => {
    if (lastExpense) {
      form.setFieldsValue(expenseToFormValues(lastExpense));
    }
  };

  const handleSubmit = () => {
    form.submit();
  };

  return (
    <ModalStyled
      open={visible}
      title={isNewExpense ? "Новая трата" : "Редактирование траты"}
      onOk={handleSubmit}
      onCancel={() => {
        close(form.getFieldValue("source") as FormValues["source"]);
      }}
      width={580}
      footer={[
        lastExpense && (
          <Button
            key="insertLast"
            type="link"
            onClick={handleInsertPreviousClick}
          >
            Подставить предыдущий
          </Button>
        ),
        isNewExpense && (
          <Checkbox
            checked={addMore}
            onChange={(e) => setAddMore(e.target.checked)}
            key="more"
          >
            Добавить ещё
          </Checkbox>
        ),
        <Button
          key="cancel"
          onClick={() => {
            close(form.getFieldValue("source") as FormValues["source"]);
          }}
        >
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {isNewExpense ? "Добавить" : "Сохранить"}
        </Button>,
      ]}
      destroyOnClose
    >
      <ExpenseModalForm
        form={form}
        setLoading={setLoading}
        onSubmit={onSubmit}
        startDate={startDate}
        endDate={endDate}
      />
    </ModalStyled>
  );
};

export default ExpenseModal;
