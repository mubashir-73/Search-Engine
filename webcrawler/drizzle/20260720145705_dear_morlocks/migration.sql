DROP TABLE "search_index";--> statement-breakpoint
ALTER TABLE "contents" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "contents" DROP COLUMN "html_source";--> statement-breakpoint
ALTER TABLE "links" DROP COLUMN "source_url";--> statement-breakpoint
ALTER TABLE "links" DROP COLUMN "anchor_text";--> statement-breakpoint
ALTER TABLE "links" DROP COLUMN "link_type";