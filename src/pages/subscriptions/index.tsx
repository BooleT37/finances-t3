import React from "react";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import SubscriptionsScreen from "~/components/subscriptions/SubscriptionsScreen";
import CategoriesStore from "~/stores/CategoriesStore";
import { type StoresToInit } from "~/stores/dataStores";
import SourcesStore from "~/stores/SourcesStore";
import SubscriptionStore from "~/stores/SubscriptionStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

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
    <SiteLayout>
      <DataFetcher stores={storesToInit}>
        <SiteHeader title="Подписки" />
        <SiteContent>
          <SubscriptionsScreen />
        </SiteContent>
      </DataFetcher>
    </SiteLayout>
  );
};

export default SubscriptionsPage;
