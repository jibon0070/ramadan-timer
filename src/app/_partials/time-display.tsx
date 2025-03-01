"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  description: string | null;
  name: string;
  time: Date;
  timerEnded?: () => void;
  holdEnd?: boolean;
};

export default function TimeDisplay({
  description,
  name,
  time,
  timerEnded,
  holdEnd = false,
}: Props) {
  const [currentDate, setCurrentDate] = useState<Date | undefined>();

  useEffect(() => {
    setCurrentDate(new Date());
    const timer = setInterval(() => {
      if (time < new Date() && !holdEnd) {
        timerEnded?.();
      } else {
        setCurrentDate(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [holdEnd, time, timerEnded]);

  return (
    <Link
      href={"/events"}
      className="flex h-screen flex-col justify-center items-center"
    >
      <div className="text-[18vw] leading-none">
        {!!currentDate &&
          formatRemainingTime(time.getTime() - currentDate.getTime())}
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
