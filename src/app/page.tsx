"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import getNextEventAction from "./_actions/get-next-event.action";
import { useToast } from "@/hooks/use-toast";
import TimeDisplay from "./_partials/time-display";

function useEngine() {
  const { toast } = useToast();
  const [time, setTime] = useState(new Date());
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string | null>(null);

  const queryKey = ["home"];
  const query = useQuery({ queryKey: queryKey, queryFn: getNextEventAction });

  useEffect(() => {
    if (query.data) {
      if (query.data.success) {
        setTime(query.data.event?.timestamp || new Date());
        setName(query.data.event?.name || "");
        setDescription(query.data.event?.description || null);
      } else {
        toast({
          title: "Error",
          description: query.data.message,
          variant: "destructive",
        });
      }
    }
  }, [query.data, toast]);

  const client = useQueryClient();

  function refetch() {
    client.invalidateQueries({ queryKey });
  }

  return {
    time,
    name,
    description,
    isLoading: query.isFetching,
    refetch,
  };
}

export default function Home() {
  const { time, name, description, isLoading, refetch } = useEngine();

  return (
    !isLoading && (
      <TimeDisplay
        description={description}
        name={name}
        time={time}
        holdEnd={isLoading}
        timerEnded={refetch}
      />
    )
  );
}
