import { Typography } from "antd";
import { type GetServerSideProps } from "next";
import React from "react";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import SettingsScreen from "~/components/settings/SettingsScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import { getServerAuthSession } from "~/server/auth";
import userSettingsStore from "~/stores/userSettingsStore";

const { Title } = Typography;

const stores: Stores = {
  categoriesStore: false,
  expenseStore: false,
  forecastStore: false,
  savingSpendingStore: false,
  sourcesStore: false,
  subscriptionStore: false,
  userSettingsStore,
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

// eslint-disable-next-line mobx/missing-observer
const SettingsPage: React.FC = () => {
  return (
    <DataFetcher stores={stores}>
      <WhiteHeader className="site-layout-background">
        <Title>Настройки</Title>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <SettingsScreen />
      </SiteContent>
    </DataFetcher>
  );
};

export default SettingsPage;
