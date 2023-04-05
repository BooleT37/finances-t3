import { Button, Space, Typography } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { DataFetcher, type Stores } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import ComparisonChart from "~/components/statistics/ComparisonChart";
import DynamicsChart from "~/components/statistics/DynamicsChart";
import { YearReview } from "~/components/statistics/YearReview";
import WhiteHeader from "~/components/WhiteHeader";
import categoriesStore from "~/readonlyStores/categories";
import sourcesStore from "~/readonlyStores/sources";
import expenseStore from "~/stores/expenseStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import subscriptionStore from "~/stores/subscriptionStore";

const YearReviewCta = styled.div`
  font-size: 16px;
  position: absolute;
  top: 0;
  left: 500px;
`;

const { Title } = Typography;

const stores: Stores = {
  categoriesStore,
  sourcesStore,
  subscriptionStore,
  savingSpendingStore,
  expenseStore,
  forecastStore: false,
  userSettingsStore: false,
};

/* eslint-disable mobx/missing-observer */
const StatisticsScreen: React.FC = () => {
  const [yearReviewOpen, setYearReviewOpen] = useState(false);

  return (
    <DataFetcher stores={stores}>
      <WhiteHeader className="site-layout-background">
        <Title>Статистика</Title>
        <YearReviewCta>
          Итоги 2022&nbsp;&nbsp;
          <Button
            onClick={() => {
              setYearReviewOpen(true);
            }}
          >
            Посмотреть
          </Button>
        </YearReviewCta>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <Space direction="vertical" size="middle">
          <ComparisonChart />
          <DynamicsChart />
        </Space>
        <YearReview
          open={yearReviewOpen}
          onClose={() => {
            setYearReviewOpen(false);
          }}
        />
      </SiteContent>
    </DataFetcher>
  );
};

export default StatisticsScreen;
