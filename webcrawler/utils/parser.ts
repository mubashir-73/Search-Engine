import * as cheerio from 'cheerio'

async function parser(html:string){
    const $ = cheerio.load(html);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const h1 = $("h1").first().text();
    const canonical = $('link[rel="canonical"]').attr("href");

    return {
        title,
        description,
        h1,
        canonical
    }
}

export default parser;