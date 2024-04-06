import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { type ExpenseComponent } from "@prisma/client";
import { Button, Form, Input, InputNumber, Modal, Space } from "antd";
import { sum } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { getTempId } from "~/utils/tempId";
import {
  buildCategorySubcategoryId,
  parseCategorySubcategoryId,
  type CategorySubcategoryId,
} from "./categorySubcategoryId";
import { CategorySubcategorySelect } from "./CategorySubcategorySelect";

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
  components: ExpenseComponent[];
  expenseId: number | null;
  expenseName: string;
  expenseCost: number;
}

function costToNumber(cost: string): number {
  if (cost === "") {
    return 0;
  }
  const parsed = parseFloat(cost);
  return isNaN(parsed) ? 0 : parsed;
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
        ({ cost, expenseId, id, name, categoryId, subcategoryId }) => ({
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
    [components]
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
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item {...restField} name={[name, "name"]}>
                        <Input placeholder="На что" />
                      </Form.Item>
                      <Form.Item
                        rules={[{ required: true, message: "Введите сумму" }]}
                        {...restField}
                        name={[name, "cost"]}
                      >
                        <InputNumber
                          placeholder="Сколько"
                          addonAfter="€"
                          style={{ width: 130 }}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        rules={[
                          { required: true, message: "Выберите категорию" },
                          {
                            validator(rule, value) {
                              const { categoryId, subcategoryId } =
                                parseCategorySubcategoryId(
                                  value as CategorySubcategoryId
                                );
                              if (categoryId !== defaultCategoryId) {
                                return Promise.resolve();
                              }
                              if (subcategoryId === defaultSubcategoryId) {
                                return Promise.reject(
                                  "Категория должна отличаться"
                                );
                              }
                              if (
                                defaultSubcategoryId === null &&
                                subcategoryId === null
                              ) {
                                return Promise.reject(
                                  "Категория должна отличаться"
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                        name={[name, "categorySubcategoryId"]}
                      >
                        <CategorySubcategorySelect
                          currentSelectedCategoryId={defaultCategoryId}
                        />
                      </Form.Item>
                      <Button
                        type="link"
                        icon={
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        }
                      />
                    </Space>
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
          <Space>
            <div>Осталось в основном расходе:</div>
            <div>
              {expenseCost - sum(currentValue.map((c) => costToNumber(c.cost)))}
            </div>
          </Space>
        </Space>
      </Form>
    </Modal>
  );
};

export default ComponentsModal;
