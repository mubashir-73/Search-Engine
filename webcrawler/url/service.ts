import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { contentTable, urlTable } from "../schema/schema.js";
import parser from "../utils/parser.js";
import { eq } from "drizzle-orm";

export function urlService(db: NodePgDatabase) {
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
  async function insertUrlById(url: string) {
    const html = await fetch(url).then((res) => res.text());
    const metadata = await parser(html);
    console.log(metadata);
    const result = await db
      .insert(urlTable)
      .values({ url: url })
      .returning({ insertedId: urlTable.id });
    await db.insert(contentTable).values({
      urlId: result[0]?.insertedId,
      title: metadata.title,
      textContent: metadata.description,
    });
    return {
      status: "Insertion successfull",
      ...result,
    };
  }
  async function deleteUrlById(urlId: number) {
    await db.delete(urlTable).where(eq(urlTable.id, urlId));
    await db.delete(contentTable).where(eq(contentTable.urlId, urlId));
    return {
      status: "Deletion Succesfull",
    };
  }

  return {
    insertUrlById,
    getUrl,
    deleteUrlById,
  };
}

/*

TODO:
HTML Parser response - fit into schema

Promise {
  {
    title: 'MDN Web DocsMDNMandalaMDNMozilla',
    description: 'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for bothWeb sites and progressive web apps.',
    h1: '\n        Resources for Developers, by Developers\n      ',
    canonical: 'https://developer.mozilla.org/en-US/'
  }
}
*/
