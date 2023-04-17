import { Typography } from "antd";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import SourcesScreen from "~/components/sources/SourcesScreen";
import WhiteHeader from "~/components/WhiteHeader";
import sourcesStore from "~/stores/sourcesStore";
import userSettingsStore from "~/stores/userSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const stores: Stores = {
  userSettingsStore,
  sourcesStore,
  categoriesStore: false,
  forecastStore: false,
  subscriptionStore: false,
  savingSpendingStore: false,
  expenseStore: false,
};

export const getServerSideProps = protectedPageProps;

// TODO:
// 1. Понять, почему имя источника визуально не изменяется
// 2. Исправить все предупрежения MOBX, относящиеся к этой странице
// 3. Исправить вообще все предепреждения MOBX

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
