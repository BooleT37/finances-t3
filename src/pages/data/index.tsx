import { Typography } from "antd";
import styled from "styled-components";
import DataScreen from "~/components/data/DataScreen";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import SiteLayout from "~/components/SiteLayout";
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

const ContentWrapper = styled("div")`
  position: relative;
  max-width: 850px;
`;

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
const DataPage = () => (
  <SiteLayout>
    <DataFetcher stores={storesToInit}>
      <WhiteHeader>
        <Title>Данные</Title>
      </WhiteHeader>
      <SiteContent>
        <ContentWrapper>
          <DataScreen />
        </ContentWrapper>
      </SiteContent>
    </DataFetcher>
  </SiteLayout>
);

export default DataPage;
