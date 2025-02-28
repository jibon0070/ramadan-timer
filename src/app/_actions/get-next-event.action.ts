"use server";

import db from "@/db";
import { EventModel } from "@/schema";
import ResponseWraper from "@/types/response-wraper";
import { and, eq, lte, ne } from "drizzle-orm";

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
    await renewYearlyEvents();
    await deletePreviousEvent();
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

async function deletePreviousEvent() {
  await db
    .delete(EventModel)
    .where(
      and(lte(EventModel.timestamp, new Date()), ne(EventModel.yearly, true)),
    );
}

async function renewYearlyEvents() {
  const currentDate = new Date();

  await db.query.EventModel.findMany({
    where: (model, { lte, and, eq }) =>
      and(lte(model.timestamp, currentDate), eq(model.yearly, true)),
    columns: { id: true, timestamp: true },
  }).then((rows) => {
    rows.forEach(async (row) => {
      const renewedDate = renewDate(row.timestamp);
      await db
        .update(EventModel)
        .set({ timestamp: renewedDate })
        .where(eq(EventModel.id, row.id));
    });
  });
}

function renewDate(date: Date): Date {
  const currentDate = new Date();
  if (date < currentDate) {
    const newDate = new Date(date.getTime() + 1000 * 60 * 60 * 24 * 365);

    if (newDate < currentDate) {
      return renewDate(newDate);
    } else {
      return newDate;
    }
  }

  return date;
}
