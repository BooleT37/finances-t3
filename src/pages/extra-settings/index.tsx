import { Typography } from "antd";
import React from "react";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import ExtraSettingsScreen from "~/components/settings/ExtraSettingsScreen";
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
const ExtraSettingsPage: React.FC = () => {
  return (
    <DataFetcher stores={stores}>
      <WhiteHeader className="site-layout-background">
        <Title>Прочие настройки</Title>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <ExtraSettingsScreen />
      </SiteContent>
    </DataFetcher>
  );
};

export default ExtraSettingsPage;
