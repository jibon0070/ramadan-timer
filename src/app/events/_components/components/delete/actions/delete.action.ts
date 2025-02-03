"use server";

import db from "@/db";
import getAuth from "@/lib/auth";
import { EventModel } from "@/schema";
import ResponseWraper from "@/types/response-wraper";
import { eq } from "drizzle-orm";
import { z } from "zod";

export default async function deleteAction(
  uData: unknown,
): Promise<ResponseWraper> {
  try {
    await validateUser();
    const id = await validateId(uData);
    await deleteEvent(id);

    return {
      success: true,
    };
  } catch (e) {
    console.trace(e);
    return {
      success: true,
      message: e instanceof Error ? e.message : "Something went wrong",
    };
  }
}

async function validateUser() {
  const auth = getAuth();

  if (!(await auth.verify("admin"))) {
    throw new Error("You are not authorized to delete events");
  }
}

async function validateId(data: unknown) {
  return z
    .number()
    .min(1)
    .superRefine(async (value, ctx) => {
      const message = await idExists(value);

      if (!!message) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        });
      }
    })
    .parseAsync(data);
}

async function idExists(id: number): Promise<string | void> {
  const event = await db.query.EventModel.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    columns: { id: true },
  });

  if (!event) return "Event does not exist";
}

async function deleteEvent(id: number) {
  await db.delete(EventModel).where(eq(EventModel.id, id));
}
