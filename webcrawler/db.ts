import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import pg from "@fastify/postgres"
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from "drizzle-orm/sql/sql";

async function dbConnector(fastify: FastifyInstance,opts:any) {
    
    await fastify.register(pg,{
        connectionString: process.env.DATABASEURL
    })

    await fastify.pg.query("SELECT 1");
    console.log("Database connected successfully")
    const db = drizzle({client : fastify.pg.pool} as any);
    await db.execute(sql`SELECT 1`);
    console.log("Drizzle connected successfully")
}


export default fp(dbConnector);
// Learn about src/types/fastify.d.ts to fix this type issue
