import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { mode: "date" })
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", { mode: "date" })
  .notNull()
  .defaultNow()
  .$onUpdateFn(() => new Date());

export const UserRoleEnum = pgEnum("role", ["general", "admin"]);

export const UserModel = pgTable("users", {
  id: serial("id").primaryKey().notNull().unique(),
  username: varchar("username").notNull().unique(),
  password: text("password").notNull(),
  role: UserRoleEnum("role").notNull().default("general"),
  createdAt,
  updatedAt,
});
