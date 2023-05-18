import { Spin } from "antd";
import { observer } from "mobx-react";
import { default as React, useEffect } from "react";
import { dataStoresStateStore, type StoresToInit } from "~/stores/dataStores";
import { SpinWrapper } from "../SpinWrapper";

interface Props {
  stores: StoresToInit;
  children: React.ReactNode;
}

export const DataFetcher: React.FC<Props> = observer(function DataFetcher({
  stores,
  children,
}) {
  const { storesLoaded, initStores } = dataStoresStateStore;

  useEffect(() => {
    void initStores(stores);
  }, [initStores, stores]);

  if (!storesLoaded(stores)) {
    return (
      <SpinWrapper>
        <Spin size="large" tip="Загрузка финансов..." />
      </SpinWrapper>
    );
  }

  return <>{children}</>;
});
