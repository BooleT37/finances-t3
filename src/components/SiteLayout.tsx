import {
  BankOutlined,
  CalendarOutlined,
  DatabaseOutlined,
  DollarOutlined,
  LineChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Spin } from "antd";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SpinWrapper } from "./SpinWrapper";

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
  getItem("Категории", "/categories", <DatabaseOutlined />),
  {
    key: "divider",
    type: "divider",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Выйти",
    onClick: () => {
      void signOut();
    },
  },
];

/* eslint-disable mobx/missing-observer */
const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession();
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn(undefined, { callbackUrl: router.asPath });
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <SpinWrapper>
        <Spin size="large" tip="Авторизация..." />
      </SpinWrapper>
    );
  }

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
