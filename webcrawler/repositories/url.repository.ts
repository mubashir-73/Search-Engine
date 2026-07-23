import { urlTable, contentTable } from "../schema/schema.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import parser from "../crawler/parser.js";
import type { ParsedPage, ParsedLinks } from "../crawler/parser.js";

export function createUrlRepository(db: NodePgDatabase) {
  async function getUrl() {
    const result = await db
      .select({ id: urlTable.id, url: urlTable.url, status: urlTable.status })
      .from(urlTable);
    return {
      status: "successfully retrieved",
      data: result.map((point) => ({
        id: point.id,
        url: point.url,
        status: point.status,
      })),
    };
  }
  async function insertUrlById(url: string): Promise<number> {
    // fetching html
    const html = await fetch(url).then((res) => res.text());
    const metadata: ParsedPage = await parser(html); //uses a parser.ts
    // Actual Insertion service
    console.log(metadata);
    const result = await db
      .insert(urlTable)
      .values({ url: url })
      .returning({ insertedId: urlTable.id });
    if (result.length === 0) {
      throw new Error("Failed to insert URL");
    }

    // Taking care of other links in site

    return result[0]!.insertedId;
  }
  async function insertDiscoveredLinks(links: ParsedLinks[], id: number) {
    for (const link of links) {
      const id = await db
        .select({ url: urlTable.id })
        .from(urlTable)
        .where(eq(urlTable.url, link.url));
      if (id.length === 0) {
        await insertUrlById(link.url); // just inserts no parsing/fetch for now
      }
      //link connection in link.repository.ts
    }
  }
  return {
    getUrl,
    insertUrlById,
    insertDiscoveredLinks,
  };
}
