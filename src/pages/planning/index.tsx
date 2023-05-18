import { Typography } from "antd";
import { DataFetcher } from "~/components/DataFetcher";
import PlanningScreen from "~/components/planning/PlanningScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import CategoriesStore from "~/stores/CategoriesStore";
import { type StoresToInit } from "~/stores/dataStores";
import ExpenseStore from "~/stores/ExpenseStore";
import ForecastStore from "~/stores/ForecastStore";
import SavingSpendingStore from "~/stores/SavingSpendingStore";
import SourcesStore from "~/stores/SourcesStore";
import SubscriptionStore from "~/stores/SubscriptionStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

const storesToInit: StoresToInit = {
  CategoriesStore,
  SourcesStore,
  ForecastStore,
  SubscriptionStore,
  SavingSpendingStore,
  ExpenseStore,
  UserSettingsStore,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const PlanningPage: React.FC = () => (
  <DataFetcher stores={storesToInit}>
    <WhiteHeader className="site-layout-background">
      <Title>Планирование</Title>
    </WhiteHeader>
    <SiteContent className="site-layout-background">
      <PlanningScreen />
    </SiteContent>
  </DataFetcher>
);

export default PlanningPage;
