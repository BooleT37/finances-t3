import { Checkbox, Form, Modal } from "antd";
import { useMemo, useState } from "react";
import styled from "styled-components";

import {
  type CategorySubcategoryId,
  buildCategorySubcategoryId,
  parseCategorySubcategoryId,
} from "~/features/category/components/categorySubcategoryId";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useSubcategoryById } from "~/features/category/facets/subcategoryById";
import { useAddManyExpenses } from "~/features/expense/api/expensesApi";
import { useGetExistingExpense } from "~/features/parsedExpense/facets/parsedExpenseExistingExpense";
import type { ParsedExpense } from "~/features/parsedExpense/ParsedExpense";
import { useImportModalContext } from "./importModalContext";
import { ParsedExpenseFormRow } from "./ParsedExpenseFormRow";
import { parsedExpenseFormValueToExpense } from "./parsedExpensesToExpense";

export interface ParsedExpenseFormValue
  extends Omit<ParsedExpense, "amount" | "existingExpense"> {
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

interface Props {
  parsedExpenses: ParsedExpense[];
}

export const ParsedExpensesModal: React.FC<Props> = ({ parsedExpenses }) => {
  const { removeParsedExpenses, selectedSource } = useImportModalContext();
  const [form] = Form.useForm<ParsedExpensesFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const addManyExpenses = useAddManyExpenses();
  const categoryById = useGetCategoryById();
  const subcategoryById = useSubcategoryById();
  const getExistingExpense = useGetExistingExpense();

  const initialValues = useMemo(
    () => ({
      expenses: parsedExpenses.map((e): ParsedExpenseFormValue => {
        const existingExpense = getExistingExpense(e);
        return {
          ...e,
          selected: !existingExpense,
          amount: e.amount.toString(),
          categorySubcategoryId: existingExpense
            ? buildCategorySubcategoryId({
                categoryId: existingExpense.category.id,
                subcategoryId: existingExpense.subcategory?.id,
              })
            : undefined,
        };
      }),
    }),
    [parsedExpenses, getExistingExpense]
  );

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
    if (!categoryById.loaded || !subcategoryById.loaded) {
      console.error("Cannot import expenses: categories not loaded");
      return;
    }
    setSubmitting(true);
    addManyExpenses.mutate(
      (values as ValidatedFormValues).expenses
        .filter((expense) => expense.selected)
        .map((expense) => {
          const { categoryId, subcategoryId } = parseCategorySubcategoryId(
            expense.categorySubcategoryId
          );
          const category = categoryById.getCategoryById(categoryId);
          const subcategory =
            subcategoryId !== null
              ? subcategoryById.getSubcategoryById(categoryId, subcategoryId)
              : null;
          return parsedExpenseFormValueToExpense(
            expense,
            selectedSource,
            category,
            subcategory
          );
        }),
      {
        onSuccess: () => {
          setSubmitting(false);
          closeModal();
        },
      }
    );
  };

  return (
    <Modal
      open
      width={1300}
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
      <Form<ParsedExpensesFormValues>
        form={form}
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
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
};
