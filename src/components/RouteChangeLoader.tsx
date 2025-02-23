import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

const RouteChangeLoader = () => {
  const router = useRouter();
  const loadingRef = useRef<LoadingBarRef>(null);

  useEffect(() => {
    const handleStart = () => {
      loadingRef.current?.continuousStart();
    };

    const handleComplete = () => {
      loadingRef.current?.complete();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <LoadingBar
      ref={loadingRef}
      color="#2563eb"
      height={3}
      shadow={true}
      waitingTime={400}
      loaderSpeed={800}
      shadowStyle={{
        boxShadow: "0 0 10px #2563eb, 0 0 5px #2563eb",
      }}
    />
  );
};

export default RouteChangeLoader;
