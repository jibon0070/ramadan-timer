import { UserModel } from "@/schema";
import { InferSelectModel } from "drizzle-orm";

type Role = InferSelectModel<typeof UserModel>["role"];

export default Role;
