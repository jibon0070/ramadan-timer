"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    refetch();
  }, [...key]);

  function refetch() {
    setIsFetching(true);
    query().then((data) => {
      setData(data);
      setIsLoading(false);
      setIsFetching(false);
    });
  }

  return { data, refetch, isLoading, isFetching };
}
