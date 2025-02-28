import {
  boolean,
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

export const EventModel = pgTable("events", {
  id: serial("id").primaryKey().notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
  yearly: boolean("yearly").notNull().default(false),
  createdAt,
  updatedAt,
});
