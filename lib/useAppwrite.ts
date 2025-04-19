import { Alert } from "react-native";
import { useEffect, useState } from "react";

function useAppwrite<T = any>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
}

export default useAppwrite;
