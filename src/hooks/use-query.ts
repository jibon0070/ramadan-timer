"use client";

import { useCallback, useEffect, useState } from "react";

export default function useQuery<R>({
  query,
  key,
}: {
  key: (string | number)[];
  query: () => Promise<R>;
}) {
  const [data, setData] = useState<R>();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);

  const refetch = useCallback(() => {
    setIsFetching(true);
    query().then((data) => {
      setData(data);
      setIsLoading(false);
      setIsFetching(false);
    });
  }, [query]);

  useEffect(() => {
    refetch();
  }, [refetch, ...key]);

  return { data, refetch, isLoading, isFetching };
}
