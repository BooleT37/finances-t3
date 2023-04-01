import { Spin } from "antd";
import { observer } from "mobx-react";
import { default as React } from "react";
import { useDataStores } from "~/hooks/useDataStores";
import categoriesStore from "~/readonlyStores/categories";
import sourcesStore from "~/readonlyStores/sources";
import expenseStore from "~/stores/expenseStore";
import savingSpendingStore from "~/stores/savingSpendingStore";
import subscriptionStore from "~/stores/subscriptionStore";
import { SpinWrapper } from "../SpinWrapper";

export const SavingSpendingScreenDataFetcher: React.FC<{
  children: React.ReactNode;
}> = observer(function SavingSpendingScreenDataFetcher({ children }) {
  const { dataLoaded } = useDataStores(
    categoriesStore,
    sourcesStore,
    subscriptionStore,
    savingSpendingStore,
    expenseStore
  );

  if (!dataLoaded) {
    return (
      <SpinWrapper>
        <Spin size="large" tip="Загрузка финансов..." />
      </SpinWrapper>
    );
  }

  return <>{children}</>;
});
