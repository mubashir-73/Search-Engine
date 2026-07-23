import { urlTable, contentTable } from "../schema/schema.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import type { ParsedLinks } from "../crawler/parser.js";
import { createLinkRepository } from "./link.repository.js";

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
  async function getOrCreateUrlId(url: string): Promise<number> {
    await db
      .insert(urlTable)
      .values({ url: url })
      .returning({ insertedId: urlTable.id })
      .onConflictDoNothing();

    const result = await db
      .select({ id: urlTable.id })
      .from(urlTable)
      .where(eq(urlTable.url, url));
    if (result.length === 0) {
      throw new Error("Failed to insert URL");
    }
    return result[0]!.id;
  }
  async function insertDiscoveredLinks(links: ParsedLinks[], sourceid: number) {
    for (const link of links) {
      const id = await getOrCreateUrlId(link.url);
      //link connection in link.repository.ts
      (await createLinkRepository(db)).createLink(sourceid, id);
    }
  }

  async function deleteUrlById(urlId: number) {
    await db.delete(urlTable).where(eq(urlTable.id, urlId));
    await db.delete(contentTable).where(eq(contentTable.urlId, urlId));
    return {
      status: "Deletion Succesfull",
    };
  }

  return {
    getUrl,
    insertUrlById: getOrCreateUrlId,
    insertDiscoveredLinks,
    deleteUrlById,
  };
}
