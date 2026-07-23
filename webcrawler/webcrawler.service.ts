import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { createUrlRepository } from "./repositories/url.repository.js";
import fetch from "./crawler/fetcher.js";
import parser, { type ParsedPage } from "./crawler/parser.js";
import { createContentRepository } from "./repositories/content.repository.js";

async function createCrawlerService(db: NodePgDatabase) {
  const urlRepository = createUrlRepository(db);
  const contentRepository = createContentRepository(db);
  async function crawl(url: string) {
    const html = await fetch(url);
    const page: ParsedPage = await parser(html);
    const id = await urlRepository.insertUrlById(url);
    await contentRepository.insertContentbyId(id, page);
    await urlRepository.insertDiscoveredLinks(page.links, id);
  }
}
