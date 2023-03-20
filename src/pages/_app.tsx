import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "moment/locale/ru";
import locale from "antd/lib/locale/ru_RU";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ConfigProvider } from "antd";

// eslint-disable-next-line mobx/missing-observer
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ConfigProvider locale={locale}>
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
