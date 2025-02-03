"use server";

import db from "@/db";
import ResponseWraper from "@/types/response-wraper";

export type Event = {
  id: number;
  name: string;
  description: string | null;
  timestamp: Date;
};

export default async function getEventsAction(): Promise<
  ResponseWraper<{ events: Event[] }>
> {
  try {
    const events = await getEvents();

    return {
      success: true,
      events,
    };
  } catch (e) {
    console.trace(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Internal server error.",
    };
  }
}

async function getEvents(): Promise<Event[]> {
  return await db.query.EventModel.findMany({
    where: (model, { gt }) => gt(model.timestamp, new Date()),
    columns: { id: true, name: true, description: true, timestamp: true },
    orderBy: (model, { asc }) => asc(model.timestamp),
  });
}
