import { Typography } from "antd";
import styled from "styled-components";
import type { Stores } from "~/components/DataFetcher";
import { DataFetcher } from "~/components/DataFetcher";
import { CurrentSpendings } from "~/components/savingSpending/CurrentSpendings";
import SavingSpendingsScreen from "~/components/savingSpending/SavingSpendingScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import categoriesStore from "~/stores/categoriesStore";
import expenseStore from "~/stores/expenseStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import sourcesStore from "~/stores/sourcesStore";
import subscriptionStore from "~/stores/subscriptionStore";
import userSettingsStore from "~/stores/userSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

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
  userSettingsStore,
  forecastStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const SavingSpendingsPage: React.FC = () => (
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

export default SavingSpendingsPage;
