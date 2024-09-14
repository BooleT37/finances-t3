import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  type InputRef,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import Decimal from "decimal.js";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { CostInput } from "~/components/CostInput";

import Subscription, {
  type SubscriptionFormValues as FormValues,
} from "~/models/Subscription";
import { dataStores } from "~/stores/dataStores";
import { DATE_FORMAT } from "~/utils/constants";

const NEW_SUBSCRIPTION_ID = -1;

interface ValidatedFormValues extends Omit<FormValues, "date" | "categoryId"> {
  firstDate: Dayjs;
  categoryId: number;
}

function formValuesToSubscription(
  id: number | null,
  values: ValidatedFormValues,
  active: boolean
): Subscription {
  return new Subscription(
    id ?? NEW_SUBSCRIPTION_ID,
    values.name,
    new Decimal(values.cost),
    dataStores.categoriesStore.getById(values.categoryId),
    null,
    values.period,
    values.firstDate,
    active,
    values.source !== null
      ? dataStores.sourcesStore.getById(values.source)
      : null
  );
}

const today = dayjs();

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

const SubscriptionModal: React.FC<Props> = observer(function SubscriptionModal({
  open,
  subscriptionId,
  onClose,
}) {
  const [form] = Form.useForm<FormValues>();
  const firstFieldRef = React.useRef<InputRef>(null);
  const [active, setActive] = React.useState(true);

  const { expenseOptions } = dataStores.categoriesStore;

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values: FormValues) =>
        runInAction(async () => {
          const subscription = formValuesToSubscription(
            subscriptionId,
            values as ValidatedFormValues,
            active
          );
          if (subscriptionId === null) {
            await dataStores.subscriptionStore.add(subscription);
          } else {
            dataStores.subscriptionStore.modify(subscription);
          }
          onClose();
        })
      )
      .catch((e) => {
        if (e instanceof Error) {
          throw e;
        }
        console.error("Validate Failed:", e);
      });
  };

  React.useEffect(() => {
    if (open) {
      if (subscriptionId === null) {
        form.setFieldsValue(INITIAL_VALUES);
        setActive(true);
      } else {
        form.setFieldsValue(
          dataStores.subscriptionStore.getFormValuesByIdOrThrow(subscriptionId)
        );
        runInAction(() => {
          const subscription =
            dataStores.subscriptionStore.getByIdOrThrow(subscriptionId);
          setActive(subscription.active);
        });
      }
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 0);
    }
  }, [form, subscriptionId, open]);

  const periodOptions = React.useMemo(() => {
    return [1, 3, 6, 12].map((period) => ({
      value: period,
      label: Subscription.periodToString(period),
    }));
  }, []);

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
            options={dataStores.sourcesStore.asOptions}
            placeholder="Не указано"
            style={{ width: 150 }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default SubscriptionModal;
