"use client";

import { useState } from "react";

export default function useMutation<P, R>({
  query,
  onSuccess,
}: {
  query: (payload: P) => Promise<R>;
  onSuccess: (r: R) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  function mutate(payload: P) {
    setIsLoading(true);
    query(payload).then((data) => {
      onSuccess(data);
      setIsLoading(false);
    });
  }

  return { mutate, isLoading };
}
