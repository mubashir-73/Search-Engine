CREATE TABLE "contents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url_id" integer NOT NULL,
	"title" varchar(255),
	"text_content" text,
	"metadata" text,
	"html_source" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_url_id" integer,
	"source_url" varchar(255),
	"target_url" varchar(255) NOT NULL,
	"anchor_text" text,
	"link_type" varchar(20) DEFAULT 'internal',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "metadata" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "metadata_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url_id" integer NOT NULL,
	"content_type" varchar(100),
	"content_length" integer,
	"http_status_code" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "search_index" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "search_index_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"keyword" varchar(255) NOT NULL,
	"url_id" integer NOT NULL,
	"frequency" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "urls" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "urls_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" varchar(255) NOT NULL UNIQUE,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"depth" integer DEFAULT 0 NOT NULL,
	"last_crawled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_url_id_urls_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_source_url_id_urls_id_fkey" FOREIGN KEY ("source_url_id") REFERENCES "urls"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "metadata" ADD CONSTRAINT "metadata_url_id_urls_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "search_index" ADD CONSTRAINT "search_index_url_id_urls_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE CASCADE;