import { Modal } from "antd";
import { useEffect, useState } from "react";
import type { DataLoader } from "~/stores/DataLoader";
import type { Stores } from "./types";

export function useDataStores(stores: Stores) {
  const [dataLoaded, setDataLoaded] = useState(false);

  const storesList = Object.values(stores).filter(
    (store): store is DataLoader => !!store
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        const datum = await Promise.all(
          storesList.map(async (store) => {
            if (store.dataLoaded || store.dataLoading) {
              return;
            }
            store.setDataLoading(true);
            const data = await store.loadData();
            store.setDataLoaded(true);
            store.setDataLoading(false);
            return data;
          })
        );
        storesList.map((store, index) => {
          if (datum[index]) {
            store.init(datum[index]);
          }
        });
        setDataLoaded(storesList.every((store) => store.dataLoaded));
      } catch (e) {
        Modal.error({
          title: "Ошибка при загрузке данных",
          content:
            "При загрузке данных произошла ошибка. Вероятнее всего, превышено время ожидания ответа. Перезагрузите страницу",
        });
        throw e;
      }
    })();
  }, [storesList]);
  return { dataLoaded };
}
