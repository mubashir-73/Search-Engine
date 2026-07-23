import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { contentTable } from "../schema/schema.js";
import type { ParsedPage } from "../crawler/parser.js";

export function createContentRepository(db: NodePgDatabase) {
  async function insertContentbyId(id: number, metadata: ParsedPage) {
    await db.insert(contentTable).values({
      urlId: id as any,
      title: metadata.title,
      textContent: metadata.description,
    });
  }
  return {
    insertContentbyId,
  };
}
