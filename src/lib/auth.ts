import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/db";
import Payload from "@/types/payload";
import Role from "@/types/role";

type Auth = {
  verify: typeof verify;
  getPayload: typeof getPayload;
  getNullablePayload: typeof getNullablePayload;
};

export default function getAuth(): Auth {
  return {
    verify,
    getPayload,
    getNullablePayload,
  };
}

async function verify(role?: Role | Role[]): Promise<boolean> {
  const payload = await getNullablePayload();

  // !role !payload
  if (!role && !payload) {
    return true;
  }

  // role !payload
  if (!!role && !payload) {
    return false;
  }

  // !role payload
  if (!role && !!payload) {
    return false;
  }

  // role payload
  if (!role || !payload) {
    return false;
  }

  const user = await getUser(payload);

  if (!user) {
    return false;
  }

  if (typeof role === "string") {
    if (role === user.role) {
      return true;
    }

    return false;
  }

  if (!role.length) {
    return true;
  }

  if (!role.includes(user.role)) {
    return false;
  }

  return true;
}

async function getToken(): Promise<string | null> {
  const token = (await cookies()).get("token")?.value;
  return !!token ? String(token) : null;
}

async function getNullablePayload(): Promise<Payload | null> {
  const token = await getToken();

  if (!token) return null;

  try {
    return await getPayload();
  } catch (e) {
    console.trace(e);
    return null;
  }
}

async function getPayload(): Promise<Payload> {
  const token = await getToken();

  if (!token) {
    throw new Error("no token");
  }

  return jwt.verify(token, process.env.JWT_SECRET!) as Payload;
}

async function getUser(
  payload: Payload,
): Promise<{ id: number; role: Role } | null> {
  return await db.query.UserModel.findFirst({
    where: (model, { eq, and }) =>
      and(
        eq(model.id, payload.id),
        eq(model.role, payload.role),
        eq(model.username, payload.username),
      ),
    columns: { id: true, username: true, role: true },
  }).then((r) => r || null);
}
