import { Spin } from "antd";
import { observer } from "mobx-react";
import { default as React, useEffect } from "react";
import { dataLoadersStore, type Stores } from "~/stores/dataLoadersStore";
import { SpinWrapper } from "../SpinWrapper";
export type { Stores } from "~/stores/dataLoadersStore";

interface Props {
  stores: Stores;
  children: React.ReactNode;
}

export const DataFetcher: React.FC<Props> = observer(function DataFetcher({
  stores,
  children,
}) {
  const { dataLoaded, initStores } = dataLoadersStore;

  useEffect(() => {
    void initStores(stores);
  }, [initStores, stores]);

  if (!dataLoaded) {
    return (
      <SpinWrapper>
        <Spin size="large" tip="Загрузка финансов..." />
      </SpinWrapper>
    );
  }

  return <>{children}</>;
});
