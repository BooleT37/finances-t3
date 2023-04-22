import { Typography } from "antd";
import styled from "styled-components";
import DataScreen from "~/components/data/DataScreen";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
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

const ContentWrapper = styled("div")`
  position: relative;
  max-width: 850px;
`;

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
const DataPage = () => (
  <DataFetcher stores={stores}>
    <WhiteHeader className="site-layout-background">
      <Title>Данные</Title>
    </WhiteHeader>
    <SiteContent className="site-layout-background">
      <ContentWrapper>
        <DataScreen />
      </ContentWrapper>
    </SiteContent>
  </DataFetcher>
);

export default DataPage;
