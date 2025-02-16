import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Space, Tooltip } from "antd";
import { getTempId } from "~/utils/tempId";

export const SubcategoriesList = () => (
  <>
    <Divider>Подкатегории:</Divider>
    <Row>
      <Col span={8} />
      <Col span={16}>
        <Form.List name="subcategories">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    rules={[{ required: true, message: "Введите имя" }]}
                    {...restField}
                    name={[name, "name"]}
                  >
                    <Input style={{ width: 200 }} />
                  </Form.Item>
                  <Tooltip title="Удалить подкатегорию">
                    <Button
                      danger
                      type="link"
                      icon={
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      }
                    />
                  </Tooltip>
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() =>
                  add({
                    id: getTempId(),
                    name: "",
                  })
                }
                block
                icon={<PlusCircleOutlined />}
              >
                Добавить
              </Button>
            </>
          )}
        </Form.List>
      </Col>
    </Row>
  </>
);
