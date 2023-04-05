import { Typography } from "antd";
import { observer } from "mobx-react";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import PlanningScreen from "~/components/planning/PlanningScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import categoriesStore from "~/readonlyStores/categories";
import sourcesStore from "~/readonlyStores/sources";
import expenseStore from "~/stores/expenseStore";
import forecastStore from "~/stores/forecastStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import subscriptionStore from "~/stores/subscriptionStore";
import userSettingsStore from "~/stores/userSettingsStore";

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

const PlanningPage = observer(function PlanningPage() {
  return (
    <DataFetcher stores={stores}>
      <WhiteHeader className="site-layout-background">
        <Title>Планирование</Title>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <PlanningScreen />
      </SiteContent>
    </DataFetcher>
  );
});

export default PlanningPage;
