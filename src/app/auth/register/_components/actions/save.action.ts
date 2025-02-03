"use server";

import getAuth from "@/lib/auth";
import ResponseWraper from "@/types/response-wraper";
import schema from "../schemas/schema";
import { z } from "zod";
import db from "@/db";
import { UserModel } from "@/schema";
import bcrypt from "bcryptjs";

export default async function saveAction(
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

  if (!(await auth.verify())) {
    throw new Error("Unauthorized");
  }
}

async function parseData(data: unknown) {
  return await schema.parseAsync(data);
}

async function save(data: z.infer<typeof schema>) {
  const doesUserExists: boolean = await db.query.UserModel.findFirst({
    columns: { id: true },
  }).then((r) => !!r);

  await db.insert(UserModel).values({
    username: data.username,
    password: bcrypt.hashSync(data.password, bcrypt.genSaltSync()),
    role: doesUserExists ? "general" : "admin",
  });
}
