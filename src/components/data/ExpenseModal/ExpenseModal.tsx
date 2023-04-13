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
import { action, reaction, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import type { BaseSelectRef } from "rc-select";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import type Expense from "~/models/Expense";
import sources from "~/readonlyStores/sources";
import categoriesStore from "~/stores/categoriesStore";
import expenseStore from "~/stores/expenseStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import subscriptionStore from "~/stores/subscriptionStore";
import type { Option } from "~/types/types";
import { DATE_FORMAT } from "~/utils/constants";
import expenseModalViewModel from "./expenseModalViewModel";
import { type FormValues, type ValidatedFormValues } from "./models";
import PersonalExpenses from "./PersonalExpenses";
import SourceLastExpenses from "./SourceLastExpenses";
import { insertExpense } from "./utils";

function expenseToFormValues(expense: Expense): FormValues {
  return {
    cost: expense.personalExpense
      ? String((expense.personalExpense.cost ?? 0) + (expense.cost ?? 0))
      : String(expense.cost),
    category: expense.category.id ?? null,
    subcategory: expense.subcategory?.id ?? undefined,
    name: expense.name || "",
    personalExpCategoryId: expense.personalExpense?.category.id ?? undefined,
    personalExpSpent: String(expense.personalExpense?.cost ?? ""),
    date: expense.date,
    source: expense.source?.id ?? undefined,
    subscription: expense.subscription?.id ?? undefined,
    savingSpendingId: expense.savingSpending
      ? expense.savingSpending.spending.id
      : undefined,
    savingSpendingCategoryId: expense.savingSpending
      ? expense.savingSpending.category.id
      : undefined,
  };
}

const ModalStyled = styled(Modal)`
  .ant-modal-footer {
    white-space: nowrap;
  }
`;

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
  const [hasPersonalExp, setHasPersonalExp] = React.useState(false);
  const { lastSource, isNewExpense } = expenseModalViewModel;
  const { incomeOptions, expenseOptions } = categoriesStore;

  const INITIAL_VALUES: FormValues = React.useMemo(
    () => ({
      cost: "",
      subscription: undefined,
      category: undefined,
      subcategory: undefined,
      name: "",
      personalExpCategoryId: undefined,
      personalExpSpent: "",
      date: today.isBetween(startDate, endDate)
        ? today
        : startDate ?? undefined,
      source: lastSource,
      savingSpendingId: undefined,
      savingSpendingCategoryId: undefined,
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
            const { categories } = savingSpendingStore.getById(
              values.savingSpendingId
            );
            if (categories.length === 1 && categories[0]) {
              values.savingSpendingCategoryId = categories[0].id;
            }
          }

          form.resetFields();
          form.setFieldsValue({ source: values.source });
          if (!hasPersonalExp) {
            values.personalExpCategoryId = undefined;
            values.personalExpSpent = "0";
          }
          const expense = await insertExpense(values as ValidatedFormValues);
          runInAction(() => {
            if (addMore.value) {
              expenseModalViewModel.lastExpenseId = expense.id;
              expenseModalViewModel.expenseId = null;
              form.setFieldsValue({ date: values.date });
            } else {
              expenseModalViewModel.close(values.source);
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
      });
  };

  React.useEffect(() => {
    return reaction(
      () => expenseModalViewModel.visible,
      () => {
        if (expenseModalViewModel.visible) {
          if (expenseModalViewModel.currentExpense) {
            form.setFieldsValue(
              expenseToFormValues(expenseModalViewModel.currentExpense)
            );
            setHasPersonalExp(
              !!expenseModalViewModel.currentExpense.personalExpense
            );
            addMore.value = false;
            isIncome.value =
              expenseModalViewModel.currentExpense.category.isIncome;
          } else {
            form.setFieldsValue(INITIAL_VALUES);
            setHasPersonalExp(false);
          }
          setTimeout(() => {
            firstFieldRef.current?.focus();
          }, 0);
        }
      }
    );
  }, [INITIAL_VALUES, addMore, form, isIncome]);

  const handleInsertPreviousClick = () => {
    if (expenseModalViewModel.lastExpense) {
      form.setFieldsValue(
        expenseToFormValues(expenseModalViewModel.lastExpense)
      );
    }
  };

  const sourceId: number | undefined =
    Form.useWatch("source", form) ?? undefined;
  const categoryId: number | undefined =
    Form.useWatch("category", form) ?? undefined;
  const category = useMemo(
    () =>
      categoryId === undefined ? null : categoriesStore.getById(categoryId),
    [categoryId]
  );
  const savingSpendingId: number | undefined =
    Form.useWatch("savingSpendingId", form) ?? undefined;
  const currentCategory =
    categoryId !== undefined ? categoriesStore.getById(categoryId) : undefined;
  const sourceExtra =
    sourceId === undefined ? undefined : (
      <SourceLastExpenses sourceId={sourceId} />
    );

  const savingSpendingCategoryOptions = React.useMemo(() => {
    if (savingSpendingId === undefined) {
      return [];
    }
    return savingSpendingStore.categoriesAsOptions(savingSpendingId);
  }, [savingSpendingId]);

  const availabileSubscriptions =
    startDate && endDate && currentCategory
      ? expenseStore.getAvailableSubscriptions(
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
      const subscription = subscriptionStore.getJsById(
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
        date: subscriptionData.firstDate,
        name: subscriptionData.subscription.name,
        source: subscription.source?.id,
      });
    }
    runInAction(() => {
      if (changedValues.savingSpendingId !== undefined) {
        const { categories } = savingSpendingStore.getById(
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

  const handleTransferAllPeClick = useCallback(
    (categoryId: number) => {
      const currentName = form.getFieldValue("name") as FormValues["name"];
      form.setFieldsValue({
        category: categoryId,
        personalExpCategoryId: undefined,
        personalExpSpent: "0",
        name: currentCategory
          ? currentName
            ? `${currentCategory.name} - ${currentName}`
            : currentCategory.name
          : currentName,
      });
      setHasPersonalExp(false);
    },
    [currentCategory, form]
  );

  const setIsIncome = action((value: boolean) => {
    isIncome.value = value;
    form.resetFields(["category"]);
  });

  return (
    <ModalStyled
      open={expenseModalViewModel.visible}
      title={
        expenseModalViewModel.isNewExpense
          ? "Новая трата"
          : "Редактирование траты"
      }
      onOk={handleSubmit}
      onCancel={() => {
        expenseModalViewModel.close(
          form.getFieldValue("source") as FormValues["source"]
        );
      }}
      width={540}
      footer={[
        expenseModalViewModel.lastExpense && (
          <Button
            key="insertLast"
            type="link"
            onClick={handleInsertPreviousClick}
          >
            Подставить предыдущий
          </Button>
        ),
        expenseModalViewModel.isNewExpense && (
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
            expenseModalViewModel.close(
              form.getFieldValue("source") as FormValues["source"]
            );
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
        name="basic"
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
            options={savingSpendingStore.asOptions}
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
          label="Сумма"
          rules={[
            { required: true, message: "Введите сумму" },
            {
              pattern: /^\d+(?:\.\d+)?$/,
              message: "Введите корректную сумму",
              validateTrigger: "onSubmit",
            },
          ]}
        >
          <Input addonAfter="€" style={{ width: 130 }} />
        </Form.Item>
        {(categoryId === undefined || !category?.isPersonal) &&
          !isIncome.value && (
            <Divider orientation="center">
              <Checkbox
                checked={hasPersonalExp}
                onChange={(e) => setHasPersonalExp(e.target.checked)}
              >
                Из личных
              </Checkbox>
            </Divider>
          )}
        {hasPersonalExp && !isIncome.value && (
          <PersonalExpenses
            form={form}
            onTransferAll={handleTransferAllPeClick}
          />
        )}
        <Form.Item
          name="date"
          label="Дата"
          rules={[{ required: true, message: "Введите дату" }]}
        >
          <DatePicker format={DATE_FORMAT} allowClear={false} />
        </Form.Item>
        <Form.Item name="name" label="Коментарий">
          <Input />
        </Form.Item>
        <Form.Item name="source" label="Источник" extra={sourceExtra}>
          <Select
            options={sources.asOptions}
            placeholder="Не указано"
            style={{ width: 150 }}
            allowClear
          />
        </Form.Item>
      </Form>
    </ModalStyled>
  );
});

export default ExpenseModal;
