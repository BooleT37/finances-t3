import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Space } from "antd";
import type { Dayjs } from "dayjs";
import Decimal from "decimal.js";
import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import { type ExpenseComponentData } from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import costToString from "~/utils/costToString";
import { decimalSum } from "~/utils/decimalSum";
import { getTempId } from "~/utils/tempId";
import {
  buildCategorySubcategoryId,
  parseCategorySubcategoryId,
  type CategorySubcategoryId,
} from "./categorySubcategoryId";
import { CategorySubcategorySelect } from "./CategorySubcategorySelect";
import { useGetForecastSum } from "./useForecastSum";

const RowSpaceStyled = styled(Space)<{ $highlighted?: boolean }>`
  display: flex;
  margin-bottom: 8px;
  position: relative;

  ${({ $highlighted }) =>
    $highlighted &&
    `
    @keyframes fade-out {
      from {opacity: 1}
      to {opacity: 0}
    }
    
    &::after {
      content: "";
      position: absolute;
      left: -12px;
      right: -12px;
      bottom: 15px;
      top: -8px;
      border-radius: 10px;
      border: solid royalblue 3px;
      opacity: 1;
      animation: fade-out 1s linear 2s 1;
      animation-fill-mode: forwards;
  }`};
`;

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
  const getForecastSum = useGetForecastSum(date);

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
                  {fields.map(({ key, name, ...restField }) => {
                    const currentComponent = currentValue[key];
                    let personalExpForecastSum: Decimal | undefined;
                    if (
                      currentComponent &&
                      currentComponent.categorySubcategoryId
                    ) {
                      const { categoryId } = parseCategorySubcategoryId(
                        currentComponent.categorySubcategoryId
                      );
                      const category =
                        dataStores.categoriesStore.getById(categoryId);
                      if (category.isPersonal) {
                        personalExpForecastSum = getForecastSum(categoryId);
                      }
                    }
                    return (
                      <RowSpaceStyled
                        key={key}
                        align="start"
                        $highlighted={
                          highlightedComponentId !== undefined &&
                          highlightedComponentId === components[name]?.id
                        }
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
                          extra={
                            personalExpForecastSum !== undefined
                              ? `Макс: ${costToString(personalExpForecastSum)}`
                              : undefined
                          }
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
                      </RowSpaceStyled>
                    );
                  })}
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
