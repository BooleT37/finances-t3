import { Space } from "antd";
import React, { useState } from "react";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import ComparisonChart from "~/features/statistics/components/ComparisonChart";
import DynamicsChart from "~/features/statistics/components/DynamicsChart";
import { YearReview } from "~/features/statistics/components/YearReview";
import { protectedPageProps } from "~/utils/protectedPageProps";

export const getServerSideProps = protectedPageProps;

const StatisticsScreen: React.FC = () => {
  const [yearReviewOpen, setYearReviewOpen] = useState(false);

  return (
    <SiteLayout>
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
    </SiteLayout>
  );
};

export default StatisticsScreen;
