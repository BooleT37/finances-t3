import { Typography } from "antd";
import React from "react";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import SettingsScreen from "~/components/settings/SettingsScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import userSettingsStore from "~/stores/userSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

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

export const getServerSideProps = protectedPageProps;

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
