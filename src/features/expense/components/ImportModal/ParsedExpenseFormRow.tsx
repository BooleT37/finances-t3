import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  type FormListFieldData,
} from "antd";
import { useEffect } from "react";
import { CategorySubcategorySelect } from "~/features/category/components/CategorySubcategorySelect";
import { DATE_FORMAT } from "~/utils/constants";
import type { ParsedExpensesFormValues } from "./ParsedExpensesModal";

export const ParsedExpenseFormRow: React.FC<FormListFieldData> = (props) => {
  const { name, ...restField } = props;
  const form = Form.useFormInstance<ParsedExpensesFormValues>();
  const amount = Form.useWatch(["expenses", name, "amount"], form);
  const parsedAmount = parseFloat(amount ?? "0");
  const amountIsNegative = !isNaN(parsedAmount) && parsedAmount < 0;
  const selected = Form.useWatch(["expenses", name, "selected"], form);

  useEffect(() => {
    form.setFields([
      {
        name: ["expenses", name, "categorySubcategoryId"],
        value: undefined,
      },
    ]);
    // resetting the categorySubcategoryId if amount sign changes
  }, [amountIsNegative, form, name]);

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Form.Item
          {...restField}
          name={[name, "selected"]}
          valuePropName="checked"
          label=""
          noStyle
        >
          <Checkbox checked={true} />
        </Form.Item>
      </div>
      <Form.Item
        {...restField}
        name={[name, "date"]}
        label=""
        rules={[{ required: true }]}
        noStyle
      >
        <DatePicker
          disabled={!selected}
          format={DATE_FORMAT}
          allowClear={false}
        />
      </Form.Item>
      <Form.Item
        {...restField}
        name={[name, "type"]}
        label=""
        rules={[{ required: selected }]}
        noStyle
      >
        <Input
          disabled={true}
          variant="borderless"
          style={{ paddingLeft: 0 }}
        />
      </Form.Item>
      <Form.Item
        {...restField}
        name={[name, "description"]}
        label=""
        rules={[{ required: selected }]}
        noStyle
      >
        <Input disabled={!selected} />
      </Form.Item>
      <Form.Item
        {...restField}
        name={[name, "amount"]}
        rules={[{ required: selected }]}
        noStyle
      >
        <Input disabled={!selected} />
      </Form.Item>
      <Form.Item
        {...restField}
        name={[name, "categorySubcategoryId"]}
        rules={[{ required: selected }]}
        noStyle
      >
        <CategorySubcategorySelect
          style={{ width: "100%" }}
          disabled={!amount || !selected}
          isExpense={amountIsNegative}
          placeholder="Выберите категорию"
        />
      </Form.Item>
    </>
  );
};
