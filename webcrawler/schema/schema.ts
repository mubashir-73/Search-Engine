import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
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
  metadata: text(),
  htmlSource: text("html_source"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const linkTable = pgTable("links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sourceUrlId: integer("source_url_id").references(() => urlTable.id, {
    onDelete: "cascade",
  }),
  sourceUrl: varchar("source_url", { length: 255 }),
  targetUrl: varchar("target_url", { length: 255 }).notNull(),
  anchorText: text("anchor_text"),
  linkType: varchar("link_type", { length: 20 }).default("internal"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const searchIndexTable = pgTable("search_index", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  keyword: varchar({ length: 255 }).notNull(),
  urlId: integer("url_id")
    .notNull()
    .references(() => urlTable.id, { onDelete: "cascade" }),
  frequency: integer().notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

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

