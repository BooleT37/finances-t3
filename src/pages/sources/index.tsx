import { Typography } from "antd";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import SourcesScreen from "~/components/sources/SourcesScreen";
import WhiteHeader from "~/components/WhiteHeader";
import { type StoresToInit } from "~/stores/dataStores";
import SourcesStore from "~/stores/SourcesStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const stores: StoresToInit = {
  UserSettingsStore,
  SourcesStore,
  CategoriesStore: false,
  ForecastStore: false,
  SubscriptionStore: false,
  SavingSpendingStore: false,
  ExpenseStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const SourcesPage: React.FC = () => {
  return (
    <DataFetcher stores={stores}>
      <WhiteHeader className="site-layout-background">
        <Title>Источники</Title>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <SourcesScreen />
      </SiteContent>
    </DataFetcher>
  );
};

export default SourcesPage;
