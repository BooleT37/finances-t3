import { Typography } from "antd";
import React from "react";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import SubscriptionsScreen from "~/components/subscriptions/SubscriptionsScreen";
import WhiteHeader from "~/components/WhiteHeader";
import sourcesStore from "~/readonlyStores/sources";
import categoriesStore from "~/stores/categoriesStore";
import subscriptionStore from "~/stores/subscriptionStore";
import userSettingsStore from "~/stores/userSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const stores: Stores = {
  categoriesStore,
  sourcesStore,
  subscriptionStore,
  userSettingsStore,
  forecastStore: false,
  savingSpendingStore: false,
  expenseStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const SubscriptionsPage: React.FC = function SubscriptionsPage() {
  return (
    <DataFetcher stores={stores}>
      <WhiteHeader className="site-layout-background">
        <Title>Подписки</Title>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <SubscriptionsScreen />
      </SiteContent>
    </DataFetcher>
  );
};

export default SubscriptionsPage;
