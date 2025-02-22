"use server";

import db from "@/db";
import ResponseWraper from "@/types/response-wraper";

type Event = {
  timestamp: Date;
  name: string;
  description: string | null;
};

export default async function getNextEventAction(): Promise<
  ResponseWraper<{
    event: Event | null;
  }>
> {
  try {
    const event = await getEvent();

    return {
      success: true,
      event,
    };
  } catch (e) {
    console.trace(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Internal server error.",
    };
  }
}

async function getEvent(): Promise<Event | null> {
  return await db.query.EventModel.findFirst({
    where: (model, { gt }) => gt(model.timestamp, new Date()),
    orderBy: (model, { asc }) => asc(model.timestamp),
    columns: { name: true, description: true, timestamp: true },
  }).then((r) => (!!r ? r : null));
}
