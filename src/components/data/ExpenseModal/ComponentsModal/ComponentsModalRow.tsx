import { MinusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  type FormListFieldData,
} from "antd";
import type { Dayjs } from "dayjs";
import styled from "styled-components";
import {
  parseCategorySubcategoryId,
  type CategorySubcategoryId,
} from "../../../categories/categorySubcategoryId";
import { CategorySubcategorySelect } from "../../../categories/CategorySubcategorySelect";
import type { FormValues } from "./ComponentsModal";

interface Props extends FormListFieldData {
  date: Dayjs | undefined;
  highlightedComponentId?: number | null;
  defaultCategoryId: number | null;
  defaultSubcategoryId: number | null;
  remove: (index: number) => void;
}

const SpaceStyled = styled(Space)<{ $highlighted?: boolean }>`
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

// eslint-disable-next-line mobx/missing-observer
export const ComponentsModalRow: React.FC<Props> = ({
  name,
  date,
  highlightedComponentId,
  defaultCategoryId,
  defaultSubcategoryId,
  remove,
  ...restField
}) => {
  const form = Form.useFormInstance<FormValues>();
  const id = Form.useWatch(["components", name, "id"], form);
  return (
    <SpaceStyled
      align="start"
      $highlighted={
        highlightedComponentId !== undefined && highlightedComponentId === id
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
        rules={[
          { required: true, message: "Выберите категорию" },
          {
            validator(_rule, value) {
              const { categoryId, subcategoryId } = parseCategorySubcategoryId(
                value as CategorySubcategoryId
              );
              if (categoryId !== defaultCategoryId) {
                return Promise.resolve();
              }
              if (subcategoryId === defaultSubcategoryId) {
                return Promise.reject(new Error("Категория должна отличаться"));
              }
              if (defaultSubcategoryId === null && subcategoryId === null) {
                return Promise.reject(new Error("Категория должна отличаться"));
              }
              return Promise.resolve();
            },
          },
        ]}
        name={[name, "categorySubcategoryId"]}
      >
        <CategorySubcategorySelect
          currentSelectedCategoryId={defaultCategoryId}
          isExpense={true}
        />
      </Form.Item>
      <Button
        type="link"
        icon={<MinusCircleOutlined onClick={() => remove(name)} />}
      />
    </SpaceStyled>
  );
};
