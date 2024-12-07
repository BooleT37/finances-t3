import { Form, Input, Modal, Switch } from "antd";
import { runInAction, toJS } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import type Subcategory from "~/models/Subcategory";
import categoryModalViewModel from "./categoryModalViewModel";
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
            icon: currentCategory.icon,
            isIncome: currentCategory.isIncome,
            isContinuous: currentCategory.isContinuous,
            subcategories: currentCategory.subcategories.map((subc) =>
              toJS(subc)
            ),
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
});

export default CategoryModal;
