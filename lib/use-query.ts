import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseQueryOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseQueryReturn<T, P> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

const useQuery = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseQueryOptions<T, P>): UseQueryReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        setData(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occured";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fn],
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = async (newParams?: P) => await fetchData(newParams!);

  return { data, isLoading, error, refetch };
};

export default useQuery;
