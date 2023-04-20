import { Typography } from "antd";
import CategoriesScreen from "~/components/categories/CategoriesScreen";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import categoriesStore from "~/stores/categoriesStore";
import userSettingsStore from "~/stores/userSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const stores: Stores = {
  categoriesStore,
  userSettingsStore,
  sourcesStore: false,
  forecastStore: false,
  subscriptionStore: false,
  savingSpendingStore: false,
  expenseStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const CategoriesPage: React.FC = () => (
  <DataFetcher stores={stores}>
    <WhiteHeader className="site-layout-background">
      <Title>Категории</Title>
    </WhiteHeader>
    <SiteContent className="site-layout-background">
      <CategoriesScreen />
    </SiteContent>
  </DataFetcher>
);

export default CategoriesPage;
