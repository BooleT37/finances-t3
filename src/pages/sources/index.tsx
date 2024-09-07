import { Typography } from "antd";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import SiteLayout from "~/components/SiteLayout";
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
    <SiteLayout>
      <DataFetcher stores={stores}>
        <WhiteHeader>
          <Title>Источники</Title>
        </WhiteHeader>
        <SiteContent>
          <SourcesScreen />
        </SiteContent>
      </DataFetcher>
    </SiteLayout>
  );
};

export default SourcesPage;
