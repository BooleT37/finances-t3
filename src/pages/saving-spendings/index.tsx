import { Typography } from "antd";
import { observer } from "mobx-react";
import styled from "styled-components";
import type { Stores } from "~/components/DataFetcher";
import { DataFetcher } from "~/components/DataFetcher";
import { CurrentSpendings } from "~/components/savingSpending/CurrentSpendings";
import SavingSpendingsScreen from "~/components/savingSpending/SavingSpendingScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import categoriesStore from "~/readonlyStores/categories";
import sourcesStore from "~/readonlyStores/sources";
import expenseStore from "~/stores/expenseStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import subscriptionStore from "~/stores/subscriptionStore";

const { Title } = Typography;

const ContentStyled = styled(SiteContent)`
  background: transparent;
`;

const stores: Stores = {
  categoriesStore,
  sourcesStore,
  subscriptionStore,
  savingSpendingStore,
  expenseStore,
  forecastStore: false,
};

const SavingSpendingsPage: React.FC = observer(function SavingSpendingsPage() {
  return (
    <DataFetcher stores={stores}>
      <WhiteHeader>
        <Title>Траты из сбережений</Title>
        <CurrentSpendings />
      </WhiteHeader>
      <ContentStyled>
        <SavingSpendingsScreen />
      </ContentStyled>
    </DataFetcher>
  );
});

export default SavingSpendingsPage;
