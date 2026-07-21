import * as cheerio from "cheerio";

export interface ParsedPage {
  title: string;
  description: string;
  h1: string;
  links: ParsedLinks[];
}

export interface ParsedLinks {
  url: string;
  anchorText: string;
}

async function parser(html: string): Promise<ParsedPage> {
  const $ = cheerio.load(html);
  const title = $("title").text();
  const description = $('meta[name="description"]').attr("content") ?? "";
  const h1 = $("h1").first().text();
  let links: ParsedLinks[] = [];
  $("a").each((index, element) => {
    links.push({
      url: $(element).attr("href") ?? "",
      anchorText: $(element).text(),
    });
  });
  return {
    title,
    description,
    h1,
    links,
  };
}

export default parser;

//TODO: I can now send all possible links so have to receive in inserturl function and store in table appropriately(check it exists and all that crap)
