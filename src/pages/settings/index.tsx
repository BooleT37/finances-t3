import { Typography } from "antd";
import React from "react";
import SettingsScreen from "~/components/settings/SettingsScreen";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";

const { Title } = Typography;

// eslint-disable-next-line mobx/missing-observer
const SettingsPage: React.FC = () => {
  return (
    <>
      <WhiteHeader className="site-layout-background">
        <Title>Настройки</Title>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <SettingsScreen />
      </SiteContent>
    </>
  );
};

export default SettingsPage;
