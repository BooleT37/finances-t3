import styled from "styled-components";
import { DataFetcher } from "~/components/DataFetcher";
import { CurrentSpendings } from "~/components/savingSpending/CurrentSpendings";
import SavingSpendingsScreen from "~/components/savingSpending/SavingSpendingScreen";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import CategoriesStore from "~/stores/CategoriesStore";
import { type StoresToInit } from "~/stores/dataStores";
import ExpenseStore from "~/stores/ExpenseStore";
import SavingSpendingStore from "~/stores/SavingSpendingStore";
import SourcesStore from "~/stores/SourcesStore";
import SubscriptionStore from "~/stores/SubscriptionStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const ContentStyled = styled(SiteContent)`
  background: transparent;
`;

const storesToInit: StoresToInit = {
  CategoriesStore,
  SourcesStore,
  SubscriptionStore,
  SavingSpendingStore,
  ExpenseStore,
  UserSettingsStore,
  ForecastStore: false,
};

export const getServerSideProps = protectedPageProps;

// eslint-disable-next-line mobx/missing-observer
const SavingSpendingsPage: React.FC = () => (
  <SiteLayout>
    <DataFetcher stores={storesToInit}>
      <SiteHeader title="Накопления и траты" />
      <CurrentSpendings />
      <ContentStyled>
        <SavingSpendingsScreen />
      </ContentStyled>
    </DataFetcher>
  </SiteLayout>
);

export default SavingSpendingsPage;
