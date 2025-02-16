import React from "react";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import ExtraSettingsScreen from "~/features/userSettings/components/ExtraSettingsScreen";
import { protectedPageProps } from "~/utils/protectedPageProps";

export const getServerSideProps = protectedPageProps;

const ExtraSettingsPage: React.FC = () => (
  <SiteLayout>
    <SiteHeader title="Дополнительные настройки" />
    <SiteContent>
      <ExtraSettingsScreen />
    </SiteContent>
  </SiteLayout>
);

export default ExtraSettingsPage;
