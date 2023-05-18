import { Typography } from "antd";
import CategoriesScreen from "~/components/categories/CategoriesScreen";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
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
  <DataFetcher stores={storesToInit}>
    <WhiteHeader className="site-layout-background">
      <Title>Категории</Title>
    </WhiteHeader>
    <SiteContent className="site-layout-background">
      <CategoriesScreen />
    </SiteContent>
  </DataFetcher>
);

export default CategoriesPage;
