"use server";

import db from "@/db";
import getAuth from "@/lib/auth";

export default async function idExistsValidator(
  id: number,
): Promise<void | string> {
  try {
    await validateUser();

    const event = await db.query.EventModel.findFirst({
      where: (model, { eq }) => eq(model.id, id),
      columns: { id: true },
    });

    if (!event) return "Event not found.";
  } catch {
    return "Internal Server Error.";
  }
}

async function validateUser() {
  const auth = getAuth();

  if (!(await auth.verify("admin"))) throw new Error("Unauthorized.");
}
