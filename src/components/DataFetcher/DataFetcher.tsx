import { Spin } from "antd";
import { observer } from "mobx-react";
import { default as React } from "react";
import { SpinWrapper } from "../SpinWrapper";
import type { Stores } from "./types";
import { useDataStores } from "./useDataStores";

interface Props {
  stores: Stores;
  children: React.ReactNode;
}

export const DataFetcher: React.FC<Props> = observer(function DataFetcher({
  stores,
  children,
}) {
  const { dataLoaded } = useDataStores(stores);

  if (!dataLoaded) {
    return (
      <SpinWrapper>
        <Spin size="large" tip="Загрузка финансов..." />
      </SpinWrapper>
    );
  }

  return <>{children}</>;
});
