import { BarsOutlined } from "@ant-design/icons";
import { type ExpenseComponent } from "@prisma/client";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import Decimal from "decimal.js";
import { action, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import type { BaseSelectRef } from "rc-select";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import type Expense from "~/models/Expense";
import { dataStores } from "~/stores/dataStores";
import type { Option } from "~/types/types";
import { DATE_FORMAT } from "~/utils/constants";
import { parseCategorySubcategoryId } from "../../categories/categorySubcategoryId";
import { ComponentsHint } from "./ComponentsHint";
import ComponentsModal from "./ComponentsModal/ComponentsModal";
import vm from "./expenseModalViewModel";
import { type FormValues, type ValidatedFormValues } from "./models";
import SourceLastExpenses from "./SourceLastExpenses";

function expenseToFormValues(expense: Expense): FormValues {
  return {
    cost: String(expense.cost),
    category: expense.category.id ?? null,
    subcategory: expense.subcategoryId ?? undefined,
    name: expense.name || "",
    date: expense.date,
    source: expense.source?.id ?? undefined,
    subscription: expense.subscription?.id ?? undefined,
    savingSpendingId: expense.savingSpending
      ? expense.savingSpending.spending.id
      : undefined,
    savingSpendingCategoryId: expense.savingSpending
      ? expense.savingSpending.category.id
      : undefined,
    actualDate: expense.actualDate ?? undefined,
  };
}

const ModalStyled = styled(Modal)`
  .ant-modal-footer {
    white-space: nowrap;
  }
`;

const costRegex = /^-?\d+(?:\.\d+)?$/;

interface Props {
  startDate: Dayjs | null;
  endDate: Dayjs | null;

  onSubmit(expense: Expense): void;
}

const RadioGroup = styled(Radio.Group)`
  display: block;
  margin: 0 0 24px 33%;
`;

const today = dayjs();

const ExpenseModal: React.FC<Props> = observer(function ExpenseModal({
  startDate,
  endDate,
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const firstFieldRef = React.useRef<BaseSelectRef>(null);
  const addMore = useLocalObservable<{ value: boolean }>(() => ({
    value: true,
  }));
  const isIncome = useLocalObservable<{ value: boolean }>(() => ({
    value: false,
  }));
  const {
    visible,
    lastSource,
    isNewExpense,
    expenseId,
    currentComponentsImmutable: currentComponents,
    currentExpense,
    lastExpense,
    componentsModalOpen,
    componentsModalIdHighlighted,
    actualDateShown,
    close,
    setLastExpenseId,
    reset,
    insertExpense,
    setCurrentComponents,
    setComponentsModalOpen,
    setActualDateShown,
  } = vm;
  const { incomeOptions, expenseOptions } = dataStores.categoriesStore;

  const INITIAL_VALUES = React.useMemo(
    (): FormValues => ({
      cost: "",
      subscription: undefined,
      category: undefined,
      subcategory: undefined,
      name: "",
      date: today.isBetween(startDate, endDate)
        ? today
        : startDate ?? undefined,
      source: lastSource,
      savingSpendingId: undefined,
      savingSpendingCategoryId: undefined,
      actualDate: undefined,
    }),
    [endDate, startDate, lastSource]
  );

  const handleSubmit = () => {
    form
      .validateFields()
      .then(
        action(async (values) => {
          setLoading(true);
          // auto set the first saving spending category if it's the only one
          if (values.savingSpendingId !== undefined) {
            const { categories } = dataStores.savingSpendingStore.getById(
              values.savingSpendingId
            );
            if (categories.length === 1 && categories[0]) {
              values.savingSpendingCategoryId = categories[0].id;
            }
          }

          const expense = await insertExpense(values as ValidatedFormValues);
          form.resetFields();
          form.setFieldsValue({ source: values.source });
          runInAction(() => {
            if (addMore.value) {
              reset();
              setLastExpenseId(expense.id);
              form.setFieldsValue({ date: values.date });
            } else {
              close(values.source);
            }
            setLoading(false);
            onSubmit(expense);
          });
        })
      )
      .catch((e) => {
        if (e instanceof Error) {
          throw e;
        }
        console.log("Validate Failed:", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    runInAction(() => {
      if (visible) {
        if (currentExpense) {
          form.setFieldsValue(expenseToFormValues(currentExpense));
          addMore.value = false;
          isIncome.value = currentExpense.category.isIncome;
          if (currentExpense.actualDate) {
            setActualDateShown(true);
          }
        } else {
          form.setFieldsValue(INITIAL_VALUES);
        }
        setTimeout(() => {
          firstFieldRef.current?.focus();
        }, 0);
      }
    });
  }, [
    INITIAL_VALUES,
    addMore,
    currentExpense,
    form,
    isIncome,
    setActualDateShown,
    visible,
  ]);

  const handleInsertPreviousClick = () => {
    if (lastExpense) {
      form.setFieldsValue(expenseToFormValues(lastExpense));
    }
  };

  const sourceId: number | undefined =
    Form.useWatch("source", form) ?? undefined;
  const categoryId: number | null = Form.useWatch("category", form) ?? null;
  const subcategoryId: number | null =
    Form.useWatch("subcategory", form) ?? null;
  const category = useMemo(
    () =>
      categoryId === null
        ? null
        : dataStores.categoriesStore.getById(categoryId),
    [categoryId]
  );
  const savingSpendingId: number | undefined =
    Form.useWatch("savingSpendingId", form) ?? undefined;
  const cost: string = Form.useWatch("cost", form) ?? "";
  const name = Form.useWatch("name", form) ?? "";
  const date = Form.useWatch("date", form);
  const currentCategory =
    categoryId !== null
      ? dataStores.categoriesStore.getById(categoryId)
      : undefined;
  const sourceExtra =
    sourceId === undefined ? undefined : (
      <SourceLastExpenses sourceId={sourceId} />
    );

  const savingSpendingCategoryOptions = React.useMemo(() => {
    if (savingSpendingId === undefined) {
      return [];
    }
    return dataStores.savingSpendingStore.categoriesAsOptions(savingSpendingId);
  }, [savingSpendingId]);

  const availabileSubscriptions =
    startDate && endDate && currentCategory
      ? dataStores.expenseStore.getAvailableSubscriptions(
          startDate,
          endDate,
          currentCategory
        )
      : [];
  const subscriptionOptions: Option[] = availabileSubscriptions.map((s) => ({
    label: s.subscription.name,
    value: s.subscription.id,
  }));

  const handleValuesChange = (changedValues: Partial<FormValues>) => {
    if (changedValues.subscription !== undefined) {
      const subscription = dataStores.subscriptionStore.getJsById(
        changedValues.subscription
      );
      if (!subscription) {
        throw new Error(
          `Couldn't find subscription by id ${changedValues.subscription}`
        );
      }
      const subscriptionData = availabileSubscriptions.find(
        (s) => s.subscription.id === changedValues.subscription
      );
      if (!subscriptionData) {
        throw new Error(
          `Couldn't find subscription with id ${changedValues.subscription}`
        );
      }
      form.setFieldsValue({
        cost: subscription.cost.toString(),
        name: subscriptionData.subscription.name,
        source: subscription.source?.id,
      });
    }
    runInAction(() => {
      if (changedValues.savingSpendingId !== undefined) {
        const { categories } = dataStores.savingSpendingStore.getById(
          changedValues.savingSpendingId
        );
        form.setFieldsValue({
          savingSpendingCategoryId:
            categories.length === 1 && categories[0]
              ? categories[0].id
              : undefined,
        });
      }
    });
    if (
      "savingSpendingId" in changedValues &&
      changedValues.savingSpendingId === undefined
    ) {
      form.setFieldsValue({
        savingSpendingCategoryId: undefined,
      });
    }
    if ("category" in changedValues) {
      form.setFieldsValue({
        subcategory: undefined,
      });
    }
  };

  const setIsIncome = action((value: boolean) => {
    isIncome.value = value;
    form.resetFields(["category"]);
  });

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
            checked={addMore.value}
            onChange={(e) =>
              runInAction(() => {
                addMore.value = e.target.checked;
              })
            }
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
    >
      <Form
        form={form}
        name="expense"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={INITIAL_VALUES}
        onFinish={handleSubmit}
        autoComplete="off"
        onValuesChange={handleValuesChange}
      >
        <RadioGroup
          value={isIncome.value ? "income" : "expense"}
          onChange={(e) => setIsIncome(e.target.value === "income")}
        >
          <Space size="large">
            <Radio value="expense">Расход</Radio>
            <Radio value="income">Доход</Radio>
          </Space>
        </RadioGroup>
        <Form.Item
          name="date"
          label="Дата"
          rules={[{ required: true, message: "Введите дату" }]}
          extra={
            !actualDateShown && (
              <Button
                type="link"
                style={{ paddingLeft: 0, paddingRight: 0 }}
                onClick={() => {
                  setActualDateShown(true);
                }}
              >
                Реальная дата отличается
              </Button>
            )
          }
        >
          <DatePicker format={DATE_FORMAT} allowClear={false} />
        </Form.Item>
        <Form.Item
          name="actualDate"
          label="Реальная дата"
          tooltip='Дата, под которой трата записана в банковском приложении. Учитывается только в подсказке "последние траты" под источником.'
          rules={
            actualDateShown
              ? [
                  { required: true, message: "Введите дату" },
                  {
                    validator: (_, value: Dayjs | undefined) => {
                      if (value?.isSame(date, "day")) {
                        return Promise.reject(
                          new Error("Реальная дата должна отличаться")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]
              : []
          }
          hidden={!actualDateShown}
          extra={
            actualDateShown && (
              <Button
                type="link"
                style={{ paddingLeft: 0, paddingRight: 0 }}
                onClick={() => {
                  setActualDateShown(false);
                }}
              >
                Реальная дата не отличается
              </Button>
            )
          }
        >
          <DatePicker format={DATE_FORMAT} allowClear />
        </Form.Item>
        <Divider />
        <Form.Item
          name="category"
          label="Категория"
          rules={[
            {
              required: true,
              message: "Выберите категорию",
            },
          ]}
        >
          <Select
            options={isIncome.value ? incomeOptions : expenseOptions}
            placeholder="Выберите категорию"
            style={{ width: 250 }}
            ref={firstFieldRef}
            showSearch
            filterOption={(input, option) =>
              (option?.text ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          hidden={
            !currentCategory || currentCategory.subcategories.length === 0
          }
          name="subcategory"
          label="Подкатегория"
        >
          <Select
            options={
              currentCategory?.subcategories.map((s) => s.asOption) ?? []
            }
            placeholder="Выберите подкатегорию"
            style={{ width: 250 }}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="savingSpendingId"
          label="Событие"
          hidden={category?.type !== "FROM_SAVINGS"}
          rules={[
            {
              required: category?.type === "FROM_SAVINGS",
              message: "Выберите событие",
            },
          ]}
        >
          <Select
            options={dataStores.savingSpendingStore.asOptions}
            placeholder="Не указано"
            style={{ width: 250 }}
            allowClear
          />
        </Form.Item>
        {category?.type === "FROM_SAVINGS" &&
          savingSpendingCategoryOptions.length > 1 && (
            <Form.Item
              name="savingSpendingCategoryId"
              label="Категория события"
              rules={[
                {
                  required: true,
                  message: "Выберите категорию",
                },
              ]}
            >
              <Select
                options={savingSpendingCategoryOptions}
                placeholder="Выберите категорию"
                style={{ width: 250 }}
              />
            </Form.Item>
          )}
        {subscriptionOptions.length > 0 && (
          <Form.Item name="subscription" label="Подписка">
            <Select
              options={subscriptionOptions}
              placeholder="Не указана"
              style={{ width: 250 }}
              allowClear
            />
          </Form.Item>
        )}
        <Form.Item
          name="cost"
          label="Сумма (€)"
          rules={[
            { required: true, message: "Введите сумму" },
            {
              pattern: costRegex,
              message: "Введите корректную сумму",
            },
          ]}
          extra={
            currentComponents.length > 0 ? (
              <ComponentsHint
                cost={cost ? new Decimal(cost) : new Decimal(0)}
                components={currentComponents}
              />
            ) : undefined
          }
        >
          <Space.Compact>
            <Input value={cost} style={{ width: 130 }} />
            <Button
              disabled={!cost || !costRegex.test(cost)}
              icon={<BarsOutlined />}
              onClick={() => {
                setComponentsModalOpen(true);
              }}
            />
          </Space.Compact>
        </Form.Item>
        <Form.Item name="name" label="Коментарий">
          <Input />
        </Form.Item>
        <Form.Item name="source" label="Источник" extra={sourceExtra}>
          <Select
            options={dataStores.sourcesStore.asOptions}
            placeholder="Не указано"
            style={{ width: 150 }}
            allowClear
          />
        </Form.Item>
      </Form>
      <ComponentsModal
        date={date}
        highlightedComponentId={componentsModalIdHighlighted}
        defaultCategoryId={categoryId}
        defaultSubcategoryId={subcategoryId}
        components={currentComponents}
        expenseId={expenseId}
        expenseName={name}
        expenseCost={cost ? new Decimal(parseFloat(cost)) : null}
        open={componentsModalOpen}
        onClose={() => {
          setComponentsModalOpen(false);
        }}
        onSave={({ components }) => {
          setCurrentComponents(
            components.map<ExpenseComponent>((c) => ({
              ...parseCategorySubcategoryId(c.categorySubcategoryId),
              cost: new Decimal(c.cost),
              expenseId: expenseId ?? -1,
              id: c.id,
              name: c.name,
            }))
          );
          setComponentsModalOpen(false);
        }}
      />
    </ModalStyled>
  );
});

export default ExpenseModal;
