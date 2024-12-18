import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space } from "antd";
import type { Dayjs } from "dayjs";
import Decimal from "decimal.js";
import React, { useCallback, useEffect, useMemo } from "react";
import { type ExpenseComponentData } from "~/models/Expense";
import { costToString } from "~/utils/costUtils";
import { decimalSum } from "~/utils/decimalSum";
import { getTempId } from "~/utils/tempId";
import {
  buildCategorySubcategoryId,
  type CategorySubcategoryId,
} from "../../../categories/categorySubcategoryId";
import { ComponentsModalRow } from "./ComponentsModalRow";

interface ExpenseComponentFormValues {
  id: number;
  name: string;
  cost: string;
  categorySubcategoryId: CategorySubcategoryId | null;
  expenseId: number | null;
}

type ExpenseComponentValidatedFormValues = Omit<
  ExpenseComponentFormValues,
  "categorySubcategoryId"
> & {
  categorySubcategoryId: CategorySubcategoryId;
};

export interface FormValues {
  components: ExpenseComponentFormValues[];
}

export interface ValidatedFormValues {
  components: ExpenseComponentValidatedFormValues[];
}

interface Props {
  defaultCategoryId: number | null;
  defaultSubcategoryId: number | null;
  open: boolean;
  onClose(): void;
  onSave(values: ValidatedFormValues): void;
  components: ExpenseComponentData[];
  expenseId: number | null;
  expenseName: string;
  expenseCost: Decimal | null;
  highlightedComponentId?: number | null;
  date: Dayjs | undefined;
}

function costToDecimal(cost: string | null): Decimal {
  if (cost === "" || cost === null) {
    return new Decimal(0);
  }
  const parsed = new Decimal(cost);
  return parsed.isNaN() ? new Decimal(0) : parsed;
}

// eslint-disable-next-line mobx/missing-observer
const ComponentsModal: React.FC<Props> = (props) => {
  const {
    open,
    components,
    expenseId,
    expenseName,
    expenseCost,
    defaultCategoryId,
    defaultSubcategoryId,
    highlightedComponentId,
    date,
    onClose,
    onSave,
  } = props;

  const [form] = Form.useForm<FormValues>();
  const currentValue = Form.useWatch("components", form) ?? [];

  const handleOk = () => {
    form?.submit();
  };

  const initialValues = useMemo<FormValues>(
    () => ({
      components: components.map(
        ({ cost, id, name, categoryId, subcategoryId }) => ({
          id,
          expenseId,
          name: name ?? "",
          cost: cost.toString(),
          categorySubcategoryId:
            subcategoryId === null
              ? `${categoryId}`
              : `${categoryId}-${subcategoryId}`,
        })
      ),
    }),
    [components, expenseId]
  );

  // This function exists with a single purpose of casting FormValues to ValidatedFormValues
  const handleSave = useCallback(
    (values: FormValues) => onSave(values as ValidatedFormValues),
    [onSave]
  );

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues, open]);

  return (
    <Modal
      title={`Составляющие расхода ${expenseName}`}
      open={open}
      onCancel={onClose}
      okText="Сохранить"
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} initialValues={initialValues} onFinish={handleSave}>
        <Space direction="vertical">
          <Form.List name="components">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <ComponentsModalRow
                      date={date}
                      defaultCategoryId={defaultCategoryId}
                      defaultSubcategoryId={defaultSubcategoryId}
                      key={key}
                      name={name}
                      remove={remove}
                      highlightedComponentId={highlightedComponentId}
                      {...restField}
                    />
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          id: getTempId(),
                          name: "",
                          cost: "",
                          categorySubcategoryId:
                            defaultCategoryId === null
                              ? null
                              : buildCategorySubcategoryId({
                                  categoryId: defaultCategoryId,
                                }),
                          expenseId,
                        } satisfies ExpenseComponentFormValues)
                      }
                      block
                      icon={<PlusOutlined />}
                    >
                      Добавить составляющую
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
          {expenseCost !== null && (
            <Space>
              <div>Осталось в основном расходе:</div>
              <div>
                {costToString(
                  expenseCost.minus(
                    decimalSum(
                      ...currentValue.map((c) => costToDecimal(c.cost))
                    )
                  )
                )}
              </div>
            </Space>
          )}
        </Space>
      </Form>
    </Modal>
  );
};

export default ComponentsModal;
