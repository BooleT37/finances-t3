import React from "react";
import { DataFetcher } from "~/components/DataFetcher";
import ExtraSettingsScreen from "~/components/settings/ExtraSettingsScreen";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import { type StoresToInit } from "~/stores/dataStores";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const storesToInit: StoresToInit = {
  UserSettingsStore,
  CategoriesStore: false,
  ExpenseStore: false,
  ForecastStore: false,
  SavingSpendingStore: false,
  SourcesStore: false,
  SubscriptionStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const ExtraSettingsPage: React.FC = () => {
  return (
    <SiteLayout>
      <DataFetcher stores={storesToInit}>
        <SiteHeader title="Дополнительные настройки" />
        <SiteContent>
          <ExtraSettingsScreen />
        </SiteContent>
      </DataFetcher>
    </SiteLayout>
  );
};

export default ExtraSettingsPage;
