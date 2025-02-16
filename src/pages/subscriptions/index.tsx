import React from "react";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import { protectedPageProps } from "~/utils/protectedPageProps";
import SubscriptionsScreen from "./components/SubscriptionsScreen";

export const getServerSideProps = protectedPageProps;

const SubscriptionsPage: React.FC = function SubscriptionsPage() {
  return (
    <SiteLayout>
      <SiteHeader title="Подписки" />
      <SiteContent>
        <SubscriptionsScreen />
      </SiteContent>
    </SiteLayout>
  );
};

export default SubscriptionsPage;
