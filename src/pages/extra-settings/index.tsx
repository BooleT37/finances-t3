import { Typography } from "antd";
import React from "react";
import { DataFetcher } from "~/components/DataFetcher";
import ExtraSettingsScreen from "~/components/settings/ExtraSettingsScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import { type StoresToInit } from "~/stores/dataStores";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

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
    <DataFetcher stores={storesToInit}>
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
