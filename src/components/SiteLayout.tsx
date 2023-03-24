import {
  BankOutlined,
  CalendarOutlined,
  DollarOutlined,
  LineChartOutlined,
  SettingOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const { Content, Sider } = Layout;

function getItem(
  label: string,
  path: string,
  icon?: React.ReactNode
): ItemType {
  return {
    key: path,
    icon,
    label: <Link href={path}>{label}</Link>,
  };
}

const items: ItemType[] = [
  getItem("Данные", "/data", <TableOutlined />),
  getItem("Траты из сбережений", "/saving-spendings", <BankOutlined />),
  getItem("Статистика", "/statistics", <LineChartOutlined />),
  getItem("Планирование", "/planning", <CalendarOutlined />),
  getItem("Подписки", "/subscriptions", <DollarOutlined />),
  getItem("Настройки", "/settings", <SettingOutlined />),
];

/* eslint-disable mobx/missing-observer */
const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={210}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div className="logo" />
        <Menu
          selectedKeys={[router.pathname]}
          theme="dark"
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default SiteLayout;
