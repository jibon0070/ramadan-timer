"use server";

import getAuth from "@/lib/auth";
import ResponseWraper from "@/types/response-wraper";
import schema from "../schemas/schema";
import { z } from "zod";
import db from "@/db";
import bcrypt from "bcryptjs";
import Payload from "@/types/payload";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type Response = ResponseWraper<Record<string, unknown>, z.infer<typeof schema>>;

export default async function submitAction(uData: unknown): Promise<Response> {
  try {
    await validateUser();
    const data = await parseData(uData);
    return await login(data);
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
  return schema.parse(data);
}

async function login(data: z.infer<typeof schema>): Promise<Response> {
  const user = await db.query.UserModel.findFirst({
    where: (model, { eq }) => eq(model.username, data.username),
    columns: { password: true, id: true, username: true, role: true },
  });

  if (!user)
    return {
      success: false,
      message: "Invalid username.",
      name: "username",
    };

  if (!bcrypt.compareSync(data.password, user.password))
    return { success: true };

  const payload: Payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  const cookie = await cookies();
  cookie.set("token", token);

  return { success: true };
}
