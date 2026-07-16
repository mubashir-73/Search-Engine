import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {urlTable} from '../schema/schema.js';
import parser from '../utils/parser.js'

export function urlService(db:NodePgDatabase ){
    async function getUrl(){
       const result = await db.select({url:urlTable.url,status:urlTable.status}).from(urlTable)
       return {
        status: "successfully retrieved",
        ...result
    };
    }
    async function insertUrlById(url : string){
    const html = await fetch(url).then(res => res.text());
    const metadata = parser(html);
    console.log(metadata)
    const result = await db.insert(urlTable).values({url:url})
    return {
        status: "Insertion successfull",
        ...result
    }
}
return{
    insertUrlById,
    getUrl
}
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