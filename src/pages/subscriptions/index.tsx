import { Typography } from "antd";
import React from "react";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import SubscriptionsScreen from "~/components/subscriptions/SubscriptionsScreen";
import WhiteHeader from "~/components/WhiteHeader";
import CategoriesStore from "~/stores/CategoriesStore";
import { type StoresToInit } from "~/stores/dataStores";
import SourcesStore from "~/stores/SourcesStore";
import SubscriptionStore from "~/stores/SubscriptionStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const storesToInit: StoresToInit = {
  CategoriesStore,
  SourcesStore,
  SubscriptionStore,
  UserSettingsStore,
  ForecastStore: false,
  SavingSpendingStore: false,
  ExpenseStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const SubscriptionsPage: React.FC = function SubscriptionsPage() {
  return (
    <DataFetcher stores={storesToInit}>
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
