"use server";

import getAuth from "@/lib/auth";
import ResponseWraper from "@/types/response-wraper";
import { z } from "zod";
import idExistsValidator from "../validators/id-exists.validator";
import dataSchema from "../../../../_partials/schemas/new-and-edit.schema";
import db from "@/db";
import { EventModel } from "@/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
  id: z.coerce
    .number()
    .min(1)
    .superRefine(async (value, ctx) => {
      const message = await idExistsValidator(value);

      if (!!message) ctx.addIssue({ message, code: "custom" });
    }),
  data: dataSchema,
});

export default async function saveAction(
  uData: unknown,
): Promise<ResponseWraper> {
  try {
    await validateUser();
    const data = await parseData(uData);
    await updateData(data);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Internal server error.",
    };
  }
}

async function validateUser() {
  const auth = getAuth();

  if (!(await auth.verify("admin"))) throw new Error("Unauthorized.");
}

async function parseData(data: unknown): Promise<z.infer<typeof schema>> {
  return await schema.parseAsync(data);
}

async function updateData(data: z.infer<typeof schema>) {
  await db
    .update(EventModel)
    .set({ ...data.data })
    .where(eq(EventModel.id, data.id));
}
