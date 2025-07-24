import * as Network from "expo-network";
import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const checkInitialStatus = async () => {
      const state = await Network.getNetworkStateAsync();
      setStatus(!!state.isConnected && !!state.isInternetReachable);
    };

    checkInitialStatus();

    const subscription = Network.addNetworkStateListener((state) => {
      setStatus(!!state.isConnected && !!state.isInternetReachable);
    });

    return () => subscription.remove();
  }, []);

  return status;
};
