"use client";

import useQuery from "@/hooks/use-query";
import { useEffect, useState } from "react";
import getNextEventAction from "./_actions/get-next-event.action";
import { useToast } from "@/hooks/use-toast";
import TimeDisplay from "./_partials/time-display";

function useEngine() {
  const { toast } = useToast();
  const [time, setTime] = useState(new Date());
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string | null>(null);

  const query = useQuery({
    key: [],
    query: getNextEventAction,
  });

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

  return {
    time,
    name,
    description,
    isLoading: query.isFetching,
    refetch: query.refetch,
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
