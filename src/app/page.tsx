"use client";

import useQuery from "@/hooks/use-query";
import { useEffect, useState } from "react";
import getNextEventAction from "./_actions/get-next-event.action";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

function useEngine() {
  const { toast } = useToast();
  const [time, setTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
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

  useEffect(() => {
    const timer = setInterval(() => {
      if (time < new Date() && !query.isFetching) {
        query.refetch();
      } else {
        setCurrentDate(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [query, time]);

  return { time, currentDate, name, description };
}

export default function Home() {
  const { time, currentDate, name, description } = useEngine();

  return (
    <Link
      href={"/events"}
      className="flex h-screen flex-col justify-center items-center"
    >
      <div className="text-[18vw] leading-none">
        {formatRemainingTime(time.getTime() - currentDate.getTime())}
      </div>
      <div className="text-[5vw] leading-none">{name}</div>
      <div>{description}</div>
    </Link>
  );
}

function formatRemainingTime(remainingTime: number): string {
  const totalSeconds = Math.floor(remainingTime / 1000);

  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 60 / 60) % 24;
  const days = Math.floor(totalSeconds / 60 / 60 / 24);

  return `${!!days ? `${days.toString().padStart(2, "0")}:` : ""}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
