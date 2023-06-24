import { CategoryType } from "@prisma/client";
import { Form, Input, Modal, Select, Switch } from "antd";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import type Subcategory from "~/models/Subcategory";
import categoryModalViewModel from "./categoryModalViewModel";
import { isContinuousTooltip } from "./isContinuousTooltip";
import { SubcategoriesList } from "./SubcategoriesList";
import { useHandleCategorySubmit } from "./useHandleCategorySubmit";

export interface FormValues {
  name: string;
  shortname: string;
  isIncome: boolean;
  isContinuous: boolean;
  type: CategoryType;
  subcategories: Subcategory[];
}

const CategoryModal = observer(function CategoryModal() {
  const { visible, currentCategory, close, isNewCategory, isIncome } =
    categoryModalViewModel;
  const [form] = Form.useForm<FormValues>();
  const { handleSubmit, loading } = useHandleCategorySubmit(form);

  useEffect(() => {
    runInAction(() => {
      if (visible) {
        if (currentCategory) {
          form.setFieldsValue({
            name: currentCategory.name,
            shortname: currentCategory.shortname,
            isIncome: currentCategory.isIncome,
            isContinuous: currentCategory.isContinuous,
            type: currentCategory.type ?? undefined,
            subcategories: currentCategory.subcategories,
          });
        } else {
          form.resetFields();
          form.setFieldValue("isIncome", isIncome);
        }
      }
    });
  }, [currentCategory, form, isIncome, visible]);

  return (
    <Modal
      title={isNewCategory ? "Новая категория" : "Редактирование категории"}
      open={visible}
      onCancel={() => {
        close();
      }}
      okText="Сохранить"
      onOk={() => {
        void handleSubmit();
      }}
      okButtonProps={{
        disabled: loading,
      }}
    >
      <Form
        form={form}
        name="category"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        disabled={loading}
        initialValues={{
          name: "",
          shortname: "",
          isIncome: false,
          isContinuous: false,
          subcategories: [],
          type: null,
        }}
      >
        <Form.Item name="isIncome" label="Доход" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          name="name"
          label="Имя"
          rules={[
            {
              required: true,
              message: "Введите имя",
            },
          ]}
        >
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item
          name="shortname"
          label="Короткое имя"
          rules={[
            {
              required: true,
              message: "Введите имя",
            },
          ]}
        >
          <Input maxLength={16} style={{ width: 130 }} />
        </Form.Item>
        <Form.Item
          name="isContinuous"
          label="Непрерывная"
          tooltip={isContinuousTooltip}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="type"
          label="Тип"
          hidden={["FROM_SAVINGS", "TO_SAVINGS"].includes(
            currentCategory?.type ?? ""
          )}
        >
          <Select
            allowClear
            placeholder="Нет типа"
            options={[
              {
                value: CategoryType.PERSONAL_EXPENSE,
                label: "Личные расходы",
              },
              { value: CategoryType.RENT, label: "Аренда" },
            ]}
          />
        </Form.Item>
        <SubcategoriesList />
      </Form>
    </Modal>
  );
});

export default CategoryModal;
