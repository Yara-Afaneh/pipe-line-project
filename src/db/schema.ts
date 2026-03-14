import { pgTable, uuid, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: varchar("external_id", { length: 256 }),
  status: varchar("status", { length: 50 }).default("pending"),
  data: jsonb("data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});