import {
  BankOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  DatabaseOutlined,
  DollarOutlined,
  LineChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Spin } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { styled } from "styled-components";
import { SpinWrapper } from "./SpinWrapper";

const { Content, Sider } = Layout;

const RootLayoutStyled = styled(Layout)`
  --site-content-vertical-margin: 24px;
  --site-content-padding: 24px;
  --site-header-height: 64px;
`;

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

const settingsItem: ItemType = {
  label: "Настройки",
  icon: <SettingOutlined />,
  key: "settings-menu",
  children: [
    getItem("Категории", "/categories", <DatabaseOutlined />),
    getItem("Источники", "/sources", <CreditCardOutlined />),
    getItem("Подписки", "/subscriptions", <DollarOutlined />),
    getItem("Прочее", "/extra-settings", <SettingOutlined />),
  ],
};

const items: ItemType[] = [
  getItem("Данные", "/data", <TableOutlined />),
  getItem("Планирование", "/planning", <CalendarOutlined />),
  getItem("Траты из сбережений", "/saving-spendings", <BankOutlined />),
  getItem("Статистика", "/statistics", <LineChartOutlined />),
  settingsItem,
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
        <div>
          <Spin size="large" />
        </div>
        Авторизация...
      </SpinWrapper>
    );
  }

  return (
    <RootLayoutStyled style={{ minHeight: "100vh" }}>
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
          defaultOpenKeys={
            settingsItem.children
              .map((c) => c?.key as string)
              .includes(router.pathname)
              ? [settingsItem.key]
              : []
          }
        />
      </Sider>
      <Layout className="site-layout">
        <Content>{children}</Content>
      </Layout>
    </RootLayoutStyled>
  );
};

export default SiteLayout;
