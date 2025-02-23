import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  type InputRef,
} from "antd";
import { type Dayjs } from "dayjs";
import Decimal from "decimal.js";
import React from "react";
import { CostInput } from "~/components/CostInput";
import { useExpenseCategoriesOptions } from "~/features/category/facets/categoriesOptions";
import { useGetCategoryById } from "~/features/category/facets/categoryById";
import { useSourceById } from "~/features/source/facets/sourceById";
import { useSourceOptions } from "~/features/source/facets/sourceOptions";
import {
  useAddSubscription,
  useUpdateSubscription,
} from "~/features/subscription/api/subscriptionsApi";
import { useGetSubscriptionFormValuesById } from "~/features/subscription/facets/formValuesMap";
import { useSubscriptionById } from "~/features/subscription/facets/subscriptionById";

import Subscription, {
  type SubscriptionFormValues as FormValues,
} from "~/features/subscription/Subscription";
import { DATE_FORMAT } from "~/utils/constants";
import { getToday } from "~/utils/today";

const NEW_SUBSCRIPTION_ID = -1;

interface ValidatedFormValues extends Omit<FormValues, "date" | "categoryId"> {
  firstDate: Dayjs;
  categoryId: number;
}

function useFormValuesToSubscription() {
  const categoryById = useGetCategoryById();
  const sourceById = useSourceById();
  return (
    id: number | null,
    values: ValidatedFormValues,
    active: boolean
  ): Subscription => {
    if (!categoryById.loaded || !sourceById.loaded) {
      throw new Error("Category or source not loaded");
    }
    return new Subscription(
      id ?? NEW_SUBSCRIPTION_ID,
      values.name,
      new Decimal(values.cost),
      categoryById.getCategoryById(values.categoryId),
      null,
      values.period,
      values.firstDate,
      active,
      values.source !== null ? sourceById.getSourceById(values.source) : null
    );
  };
}

const today = getToday();

const INITIAL_VALUES: FormValues = {
  id: 0,
  name: "",
  cost: "",
  categoryId: null,
  period: 1,
  firstDate: today,
  source: null,
};

interface Props {
  open: boolean;
  subscriptionId: number | null;
  onClose(): void;
}

const SubscriptionModal: React.FC<Props> = ({
  open,
  subscriptionId,
  onClose,
}) => {
  const [form] = Form.useForm<FormValues>();
  const firstFieldRef = React.useRef<InputRef>(null);
  const [active, setActive] = React.useState(true);

  const expenseOptions = useExpenseCategoriesOptions();
  const formValuesToSubscription = useFormValuesToSubscription();
  const addSubscription = useAddSubscription();
  const updateSubscription = useUpdateSubscription();
  const subscriptionById = useSubscriptionById();
  const getSubscriptionFormValuesById = useGetSubscriptionFormValuesById();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values: FormValues) => {
        const subscription = formValuesToSubscription(
          subscriptionId,
          values as ValidatedFormValues,
          active
        );
        if (subscriptionId === null) {
          addSubscription.mutate(subscription, {
            onSuccess: () => {
              onClose();
            },
          });
        } else {
          updateSubscription.mutate(subscription, {
            onSuccess: () => {
              onClose();
            },
          });
        }
      })
      .catch((e) => {
        if (e instanceof Error) {
          throw e;
        }
        console.error("Validate Failed:", e);
      });
  };

  React.useEffect(() => {
    if (!subscriptionById.loaded) {
      return;
    }
    if (open) {
      if (subscriptionId === null) {
        form.setFieldsValue(INITIAL_VALUES);
        setActive(true);
      } else {
        form.setFieldsValue(getSubscriptionFormValuesById(subscriptionId));
        const subscription =
          subscriptionById.getSubscriptionById(subscriptionId);
        setActive(subscription.active);
      }
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 0);
    }
  }, [
    form,
    subscriptionId,
    open,
    getSubscriptionFormValuesById,
    subscriptionById,
  ]);

  const periodOptions = React.useMemo(
    () =>
      [1, 3, 6, 12].map((period) => ({
        value: period,
        label: Subscription.periodToString(period),
      })),
    []
  );

  const sourceOptions = useSourceOptions();

  return (
    <Modal
      open={open}
      title={
        subscriptionId === null ? "Новая подписка" : "Редактирование подписки"
      }
      onOk={handleSubmit}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {subscriptionId === null ? "Добавить" : "Сохранить"}
        </Button>,
      ]}
      width={545}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={INITIAL_VALUES}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: "Введите имя" }]}
        >
          <Input ref={firstFieldRef} />
        </Form.Item>
        <Form.Item
          name="cost"
          label="Сумма"
          rules={[
            { required: true, message: "Введите сумму" },
            {
              pattern: /^[0-9.-]+$/,
              message: "Сумма должна быть числом",
              validateTrigger: "onChange",
            },
          ]}
        >
          <CostInput />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Категория"
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Select options={expenseOptions} placeholder="Начните вводить" />
        </Form.Item>
        <Form.Item name="period" label="Период" rules={[{ required: true }]}>
          <Select options={periodOptions} style={{ width: 100 }} />
        </Form.Item>
        <Form.Item
          name="firstDate"
          label="Первая дата списания"
          rules={[{ required: true, message: "Введите дату" }]}
        >
          <DatePicker format={DATE_FORMAT} allowClear={false} />
        </Form.Item>
        <Form.Item name="source" label="Источник">
          <Select
            options={sourceOptions}
            placeholder="Не указано"
            style={{ width: 150 }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubscriptionModal;
