import { Form, Input, Modal, Switch } from "antd";
import { useEffect } from "react";
import type Subcategory from "~/features/category/Subcategory";
import {
  CategoryModalContextProvider,
  useCategoryModalContext,
} from "./categoryModalContext";
import { IconSelect } from "./IconSelect";
import { isContinuousTooltip } from "./isContinuousTooltip";
import { SubcategoriesList } from "./SubcategoriesList";
import { useHandleCategorySubmit } from "./useHandleCategorySubmit";

export interface FormValues {
  name: string;
  icon: string | null;
  shortname: string;
  isIncome: boolean;
  isContinuous: boolean;
  subcategories: Subcategory[];
}

const CategoryModal = () => {
  const { visible, currentCategory, close, isNewCategory, isIncome } =
    useCategoryModalContext();
  const [form] = Form.useForm<FormValues>();
  const { handleSubmit, loading } = useHandleCategorySubmit(form);

  useEffect(() => {
    if (visible) {
      if (currentCategory) {
        form.setFieldsValue({
          name: currentCategory.name,
          shortname: currentCategory.shortname,
          icon: currentCategory.icon,
          isIncome: currentCategory.isIncome,
          isContinuous: currentCategory.isContinuous,
          subcategories: currentCategory.subcategories,
        });
      } else {
        form.resetFields();
        form.setFieldValue("isIncome", isIncome);
      }
    }
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
        <Form.Item name="icon" label="Иконка">
          <IconSelect />
        </Form.Item>
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
        <SubcategoriesList />
      </Form>
    </Modal>
  );
};

const CategoryModalWithProvider = () => (
  <CategoryModalContextProvider>
    <CategoryModal />
  </CategoryModalContextProvider>
);

export default CategoryModalWithProvider;
