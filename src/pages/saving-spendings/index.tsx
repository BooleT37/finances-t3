import { Typography } from "antd";
import styled from "styled-components";
import { DataFetcher } from "~/components/DataFetcher";
import { CurrentSpendings } from "~/components/savingSpending/CurrentSpendings";
import SavingSpendingsScreen from "~/components/savingSpending/SavingSpendingScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";
import CategoriesStore from "~/stores/CategoriesStore";
import { type StoresToInit } from "~/stores/dataStores";
import ExpenseStore from "~/stores/ExpenseStore";
import SavingSpendingStore from "~/stores/SavingSpendingStore";
import SourcesStore from "~/stores/SourcesStore";
import SubscriptionStore from "~/stores/SubscriptionStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const { Title } = Typography;

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
  <DataFetcher stores={storesToInit}>
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
