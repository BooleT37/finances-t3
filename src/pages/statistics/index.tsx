import { Space } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { DataFetcher } from "~/components/DataFetcher";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import ComparisonChart from "~/components/statistics/ComparisonChart";
import DynamicsChart from "~/components/statistics/DynamicsChart";
import { YearReview } from "~/components/statistics/YearReview";
import CategoriesStore from "~/stores/CategoriesStore";
import { type StoresToInit } from "~/stores/dataStores";
import ExpenseStore from "~/stores/ExpenseStore";
import SavingSpendingStore from "~/stores/SavingSpendingStore";
import SourcesStore from "~/stores/SourcesStore";
import SubscriptionStore from "~/stores/SubscriptionStore";
import UserSettingsStore from "~/stores/UserSettingsStore";
import { protectedPageProps } from "~/utils/protectedPageProps";

const YearReviewCta = styled.div`
  font-size: 16px;
  position: absolute;
  top: 0;
  left: 500px;
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

/* eslint-disable mobx/missing-observer */
const StatisticsScreen: React.FC = () => {
  const [yearReviewOpen, setYearReviewOpen] = useState(false);

  return (
    <SiteLayout>
      <DataFetcher stores={storesToInit}>
        <SiteHeader title="Статистика" />
        <SiteContent>
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
    </SiteLayout>
  );
};

export default StatisticsScreen;
