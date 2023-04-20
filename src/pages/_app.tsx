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
import "antd/dist/reset.css";
import Head from "next/head";
import SiteLayout from "~/components/SiteLayout";
import configureMobx from "~/utils/configureMobx";

// eslint-disable-next-line mobx/missing-observer
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Персональные финансы</title>
      </Head>
      <SessionProvider session={session}>
        <ConfigProvider locale={locale}>
          <SiteLayout>
            <Component {...pageProps} />
          </SiteLayout>
        </ConfigProvider>
      </SessionProvider>
    </>
  );
};

setupDayJs();
configureMobx();

export default api.withTRPC(MyApp);
