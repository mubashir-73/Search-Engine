import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import pg from "@fastify/postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function dbConnector(fastify: FastifyInstance, _opts: any) {
  await fastify.register(pg, {
    connectionString: process.env.DATABASEURL,
  });

  await fastify.pg.query("SELECT 1");
  const db = drizzle({ client: fastify.pg.pool } as any);
  await db.execute(sql`SELECT 1`);

  fastify.decorate("db", db);
  console.log("Database connected successfully");
  console.log("Drizzle connected successfully");
}

export default fp(dbConnector);
