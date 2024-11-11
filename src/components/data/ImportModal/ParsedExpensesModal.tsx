import { Checkbox, Form, Modal } from "antd";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import type { CategorySubcategoryId } from "~/components/categories/categorySubcategoryId";
import type { ParsedExpense } from "~/models/ParsedExpense";
import { dataStores } from "~/stores/dataStores";
import vm from "./ImportModalViewModel";
import { ParsedExpenseFormRow } from "./ParsedExpenseFormRow";
import { parsedExpenseFormValueToExpense } from "./parsedExpensesToExpense";

export interface ParsedExpenseFormValue extends Omit<ParsedExpense, "amount"> {
  amount: string;
  selected: boolean;
  categorySubcategoryId?: CategorySubcategoryId;
}

export interface ValidatedParsedExpenseFormValue
  extends ParsedExpenseFormValue {
  categorySubcategoryId: CategorySubcategoryId;
}

export interface ParsedExpensesFormValues {
  expenses: ParsedExpenseFormValue[];
}

interface ValidatedFormValues {
  expenses: ValidatedParsedExpenseFormValue[];
}

const GridStyled = styled.div`
  display: grid;
  grid-template-columns: 20px 2fr 3fr 8fr 100px 4fr;
  gap: 8px 12px;
`;

const HeaderStyled = styled.div`
  font-weight: bold;
`;

export const ParsedExpensesModal: React.FC = observer(() => {
  const { parsedExpenses, selectedSource, removeParsedExpenses } = vm;
  const [form] = Form.useForm<ParsedExpensesFormValues>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    runInAction(() =>
      form.setFieldsValue({
        expenses: parsedExpenses?.map(
          (e): ParsedExpenseFormValue => ({
            ...e,
            selected: true,
            amount: e.amount.toString(),
          })
        ),
      })
    );
  }, [form, parsedExpenses]);
  const handleOkClick = () => {
    form.submit();
  };
  const handleToggleSelectAll = () => {
    const expenses = form.getFieldValue("expenses") as ParsedExpenseFormValue[];
    const allChecked = expenses.every((e) => e.selected);
    form.setFieldsValue({
      expenses: expenses.map((e) => ({ ...e, selected: !allChecked })),
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expenses = Form.useWatch("expenses", form) ?? [];
  const allChecked = useMemo(
    () => expenses.every((e) => e.selected),
    [expenses]
  );
  const intederminate = useMemo(
    () => expenses.some((e) => e.selected) && !allChecked,
    [expenses, allChecked]
  );

  const closeModal = () => {
    removeParsedExpenses();
    form.setFieldsValue({
      expenses: [],
    });
  };

  const handleSubmit = async (values: ParsedExpensesFormValues) => {
    if (!selectedSource) {
      console.error("Cannot import expenses without a source");
      return;
    }
    setSubmitting(true);
    await dataStores.expenseStore.addMany(
      (values as ValidatedFormValues).expenses
        .filter((expense) => expense.selected)
        .map((expense) =>
          parsedExpenseFormValueToExpense(expense, selectedSource)
        )
    );
    setSubmitting(false);
    closeModal();
  };
  return (
    <Modal
      width={1300}
      open={!!parsedExpenses}
      title="Импортировать расходы"
      onClose={closeModal}
      onCancel={closeModal}
      okText="Импортировать"
      onOk={handleOkClick}
      okButtonProps={{
        loading: submitting,
        disabled: expenses.every((e) => !e.selected),
      }}
    >
      <Form<ParsedExpensesFormValues> form={form} onFinish={handleSubmit}>
        <Form.List name="expenses">
          {(fields) => (
            <GridStyled>
              <HeaderStyled style={{ textAlign: "right" }}>
                <Checkbox
                  checked={allChecked}
                  indeterminate={intederminate}
                  onChange={handleToggleSelectAll}
                />
              </HeaderStyled>
              <HeaderStyled>Дата</HeaderStyled>
              <HeaderStyled>Тип</HeaderStyled>
              <HeaderStyled>Описание</HeaderStyled>
              <HeaderStyled>Сумма (€)</HeaderStyled>
              <HeaderStyled>Категория</HeaderStyled>
              {fields.map((field) => (
                <ParsedExpenseFormRow {...field} key={field.key} />
              ))}
            </GridStyled>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
});
