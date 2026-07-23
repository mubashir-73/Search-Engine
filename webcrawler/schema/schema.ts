import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  unique,
} from "drizzle-orm/pg-core";

export enum UrlStatus {
  PENDING = "pending",
  CRAWLED = "crawled",
  ERROR = "error",
}

export const urlTable = pgTable("urls", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: varchar({ length: 255 }).notNull().unique(),
  status: varchar({ length: 20 }).notNull().default(UrlStatus.PENDING),
  depth: integer().notNull().default(0),
  lastCrawledAt: timestamp("last_crawled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const contentTable = pgTable("contents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  urlId: integer("url_id")
    .notNull()
    .references(() => urlTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }),
  textContent: text("text_content"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const linkTable = pgTable(
  "links",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sourceUrlId: integer("source_url_id").references(() => urlTable.id, {
      onDelete: "cascade",
    }),
    targetUrlId: integer("target_url_id").references(() => urlTable.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("Links_source_target_unique").on(
      table.sourceUrlId,
      table.targetUrlId,
    ),
  ],
);

export const metadataTable = pgTable("metadata", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  urlId: integer("url_id")
    .notNull()
    .references(() => urlTable.id, { onDelete: "cascade" }),
  contentType: varchar("content_type", { length: 100 }),
  contentLength: integer("content_length"),
  httpStatusCode: integer("http_status_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
