//TODO: CREATE LINK REPOSITORY
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { linkTable } from "../schema/schema.js";

export async function createLinkRepository(db: NodePgDatabase) {
  async function createLink(sourceUrlId: number, targetUrlId: number) {
    await db
      .insert(linkTable)
      .values({ sourceUrlId: sourceUrlId, targetUrlId: targetUrlId });
  }
  return {
    createLink,
  };
}
