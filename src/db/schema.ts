import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const pipelines = pgTable("pipelines", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  actionType: text("action_type").notNull(),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  pipelineId: uuid("pipeline_id")
    .references(() => pipelines.id)
    .notNull(),
  url: text("url").notNull(),
  active: text("active").default("true"),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  pipelineId: uuid("pipeline_id")
    .references(() => pipelines.id)
    .notNull(),
  data: jsonb("data").notNull(),
  result: jsonb("result"),
  status: text("status").default("pending"),
  error: text("error"),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  nextRetryAt: timestamp("next_retry_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deliveries = pgTable("deliveries", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),
  subscriberId: uuid("subscriber_id")
    .references(() => subscribers.id)
    .notNull(),
  status: text("status").default("pending"),
  attempt: integer("attempt").default(1),
  responseStatus: integer("response_status"),
  error: text("error"),
  nextRetryAt: timestamp("next_retry_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
