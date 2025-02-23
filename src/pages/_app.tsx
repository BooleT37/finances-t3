import { ConfigProvider } from "antd";
import locale from "antd/lib/locale/ru_RU";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import setupDayJs from "~/utils/setupDayJs";

import "~/styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import "antd/dist/reset.css";
import Head from "next/head";
import RouteChangeLoader from "~/components/RouteChangeLoader";
import { api } from "~/utils/api";
import { queryClient } from "../features/shared/queryClient";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <>
    <Head>
      <title>Персональные финансы</title>
    </Head>
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={locale}>
          <RouteChangeLoader />
          <Component {...pageProps} />
        </ConfigProvider>
      </QueryClientProvider>
    </SessionProvider>
  </>
);

setupDayJs();

export default api.withTRPC(MyApp);
