import { Typography } from "antd";
import React from "react";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import SubscriptionsScreen from "~/components/subscriptions/SubscriptionsScreen";
import WhiteHeader from "~/components/WhiteHeader";
import categoriesStore from "~/readonlyStores/categories";
import sourcesStore from "~/readonlyStores/sources";
import subscriptionStore from "~/stores/subscriptionStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const stores: Stores = {
  categoriesStore,
  sourcesStore,
  subscriptionStore,
  forecastStore: false,
  savingSpendingStore: false,
  expenseStore: false,
  userSettingsStore: false,
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
