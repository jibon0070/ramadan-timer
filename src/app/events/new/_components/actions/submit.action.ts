"use server";

import getAuth from "@/lib/auth";
import ResponseWraper from "@/types/response-wraper";
import { z } from "zod";
import db from "@/db";
import { EventModel } from "@/schema";
import schema from "../../../_partials/schemas/new-and-edit.schema";

export default async function submitAction(
  uData: unknown,
): Promise<ResponseWraper> {
  try {
    await validateUser();
    const data = await parseData(uData);
    await save(data);

    return {
      success: true,
    };
  } catch (e) {
    console.trace(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Internal server error.",
    };
  }
}

async function validateUser() {
  const auth = getAuth();

  if (!(await auth.verify("admin"))) {
    throw new Error("Unauthorized");
  }
}

async function parseData(data: unknown) {
  return schema.parse(data);
}

async function save(data: z.infer<typeof schema>) {
  await db.insert(EventModel).values({ ...data });
}
