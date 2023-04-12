import { Divider, Form, Select, type FormInstance } from "antd";
import React, { useCallback } from "react";
import { PersonalExpCategoryIdsRename } from "~/models/Category";
import { type FormValues } from "../models";
import { PersonalExpenseCostInput } from "./PersonalExpenseCostInput";
import { useForecastSum } from "./useForecastSum";

const { Option } = Select;

interface Props {
  form: FormInstance<FormValues>;
  onTransferAll(categoryId: number): void;
}

// eslint-disable-next-line mobx/missing-observer
const PersonalExpenses: React.FC<Props> = ({ form, onTransferAll }) => {
  const spent = Form.useWatch("personalExpSpent", form);
  const categoryId = Form.useWatch("personalExpCategoryId", form);
  const date = Form.useWatch("date", form);
  const forecastSum = useForecastSum(date, categoryId);

  const extra = forecastSum !== undefined ? `Макс: ${forecastSum}` : undefined;
  const exceeds = forecastSum !== undefined && parseFloat(spent) > forecastSum;

  const handleTransferAllClick = useCallback(() => {
    if (categoryId !== undefined) {
      onTransferAll(categoryId);
    }
  }, [categoryId, onTransferAll]);

  return (
    <>
      <Form.Item
        name="personalExpCategoryId"
        label="Чьи личные деньги"
        rules={[{ required: true, message: "Выберите, чьи деньги" }]}
      >
        <Select style={{ width: 130 }}>
          <Option value={PersonalExpCategoryIdsRename.Alexey}>Алексей</Option>
          <Option value={PersonalExpCategoryIdsRename.Lena}>Лена</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="personalExpSpent"
        label="Сумма личных денег"
        extra={extra}
        rules={[{ required: true, message: "Введите сумму" }]}
      >
        <PersonalExpenseCostInput
          disabled={categoryId === null}
          status={exceeds ? "warning" : ""}
          onTransferAllClick={handleTransferAllClick}
        />
      </Form.Item>
      <Divider />
    </>
  );
};

export default PersonalExpenses;
