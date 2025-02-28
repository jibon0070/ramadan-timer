"use client";

import TimeDisplay from "@/app/_partials/time-display";
import { useRouter } from "next/navigation";

type Props = {
  description: string | null;
  name: string;
  time: Date;
};

export default function Client({ description, name, time }: Props) {
  const router = useRouter();

  return (
    <TimeDisplay
      description={description}
      name={name}
      time={time}
      timerEnded={() => router.replace(`/`)}
    />
  );
}
