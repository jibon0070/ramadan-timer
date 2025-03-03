"use server";

import db from "@/db";
import { EventModel } from "@/schema";
import ResponseWraper from "@/types/response-wraper";
import { asc, count, gt } from "drizzle-orm";
import { z } from "zod";

export type Event = {
  id: number;
  name: string;
  description: string | null;
  timestamp: Date;
};

export default async function getEventsAction(
  uPage?: unknown,
  uLimit?: number,
): Promise<ResponseWraper<{ events: Event[]; totalPage: number }>> {
  try {
    const page = z.coerce
      .number()
      .nonnegative()
      .optional()
      .default(1)
      .parse(uPage);
    const limit = z.coerce
      .number()
      .nonnegative()
      .optional()
      .default(20)
      .parse(uLimit);

    const { events, totalPage } = await getEvents(page, limit);

    return {
      success: true,
      events,
      totalPage,
    };
  } catch (e) {
    console.trace(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Internal server error.",
    };
  }
}

async function getEvents(
  page: number,
  limit: number,
): Promise<{ events: Event[]; totalPage: number }> {
  const offset = (page - 1) * limit;

  const query = db
    .select({
      id: EventModel.id,
      name: EventModel.name,
      description: EventModel.description,
      timestamp: EventModel.timestamp,
    })
    .from(EventModel)
    .where(gt(EventModel.timestamp, new Date()))
    .as("query");

  const events = await db
    .select()
    .from(query)
    .orderBy(asc(query.timestamp))
    .limit(limit)
    .offset(offset);

  const totalPage = await db
    .select({ total: count(query.id) })
    .from(query)
    .then((row) => Math.ceil((row.at(0)?.total || 0) / limit));

  return { events, totalPage };
}
