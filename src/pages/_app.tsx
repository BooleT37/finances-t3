import { ConfigProvider } from "antd";
import locale from "antd/lib/locale/ru_RU";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import setupDayJs from "~/utils/setupDayJs";

import "~/styles/globals.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "antd/dist/reset.css";
import SiteLayout from "~/components/SiteLayout";

// eslint-disable-next-line mobx/missing-observer
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ConfigProvider locale={locale}>
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </ConfigProvider>
    </SessionProvider>
  );
};

setupDayJs();

export default api.withTRPC(MyApp);
