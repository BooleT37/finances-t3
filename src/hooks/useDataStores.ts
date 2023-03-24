import { useEffect, useRef, useState } from "react";
import { type DataLoader } from "~/stores/DataLoader";

interface StoreState {
  store: DataLoader<unknown>;
  loading: boolean;
  loaded: boolean;
}

export function useDataStores(...stores: DataLoader<unknown>[]) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const storesState = useRef<StoreState[]>(
    stores.map((store) => ({ store, loading: false, loaded: false }))
  );

  function setStoreLoading(index: number) {
    const storeState = storesState.current[index];
    if (storeState) {
      storeState.loading = true;
    }
  }

  function setStoreLoaded(index: number) {
    const storeState = storesState.current[index];
    if (storeState) {
      storeState.loaded = true;
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const datum = await Promise.all(
        storesState.current.map(async (storeState, index) => {
          if (storeState.loaded || storeState.loading) {
            return;
          }
          setStoreLoading(index);
          const data = await storeState.store.loadData();
          setStoreLoaded(index);
          return data;
        })
      );
      storesState.current.map((storeState, index) => {
        if (datum[index]) {
          storeState.store.init(datum[index]);
        }
      });
      setDataLoaded(true);
    })();
  }, [stores]);
  return { dataLoaded };
}
