import { Typography } from "antd";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import PlanningScreen from "~/components/planning/PlanningScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import categoriesStore from "~/stores/categoriesStore";
import expenseStore from "~/stores/expenseStore";
import forecastStore from "~/stores/forecastStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import sourcesStore from "~/stores/sourcesStore";
import subscriptionStore from "~/stores/subscriptionStore";
import userSettingsStore from "~/stores/userSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const stores: Stores = {
  categoriesStore,
  sourcesStore,
  forecastStore,
  subscriptionStore,
  savingSpendingStore,
  expenseStore,
  userSettingsStore,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const PlanningPage: React.FC = () => (
  <DataFetcher stores={stores}>
    <WhiteHeader className="site-layout-background">
      <Title>Планирование</Title>
    </WhiteHeader>
    <SiteContent className="site-layout-background">
      <PlanningScreen />
    </SiteContent>
  </DataFetcher>
);

export default PlanningPage;
