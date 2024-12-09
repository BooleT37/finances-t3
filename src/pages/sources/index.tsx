import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import SourcesScreen from "~/components/sources/SourcesScreen";
import { type StoresToInit } from "~/stores/dataStores";
import SourcesStore from "~/stores/SourcesStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

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
        <SiteHeader title="Источники" />
        <SiteContent>
          <SourcesScreen />
        </SiteContent>
      </DataFetcher>
    </SiteLayout>
  );
};

export default SourcesPage;
