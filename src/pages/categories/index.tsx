import { Typography } from "antd";
import CategoriesScreen from "~/components/categories/CategoriesScreen";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import CategoriesStore from "~/stores/CategoriesStore";
import { type StoresToInit } from "~/stores/dataStores";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const storesToInit: StoresToInit = {
  CategoriesStore,
  UserSettingsStore,
  SourcesStore: false,
  ForecastStore: false,
  SubscriptionStore: false,
  SavingSpendingStore: false,
  ExpenseStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const CategoriesPage: React.FC = () => (
  <SiteLayout>
    <DataFetcher stores={storesToInit}>
      <SiteHeader title="Категории" />
      <SiteContent>
        <CategoriesScreen />
      </SiteContent>
    </DataFetcher>
  </SiteLayout>
);

export default CategoriesPage;
