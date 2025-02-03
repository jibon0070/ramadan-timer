"use server";

import db from "@/db";
import getAuth from "@/lib/auth";

export default async function uniqueUsernameValidator(
  username: string,
): Promise<string | void> {
  try {
    const auth = getAuth();

    if (!(await auth.verify())) {
      return "Unauthorized";
    }

    const user = await db.query.UserModel.findFirst({
      where: (model, { eq }) => eq(model.username, username),
      columns: { id: true },
    });

    if (!!user) {
      return "Username already exists.";
    }
  } catch (e) {
    console.trace(e);
    return e instanceof Error ? e.message : "Internal server error.";
  }
}
