import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

declare module "fastify" {
  interface FastifyInstance {
    db: NodePgDatabase;
  }
}
// 1. Extend the Fastify Postgres plugin types
declare module '@fastify/postgres' {
  export interface PostgresPluginObject {
    /**
     * The node-postgres connection pool instance
     */
    pool: Pool;
    /**
     * Connect to the database and retrieve a client from the pool
     */
    connect(): Promise<PoolClient>;
    /**
     * Shorthand utility to run a query directly against the pool
     */
    query<R extends QueryResultRow = any, I extends any[] = any[]>(
      queryText: string,
      values?: I
    ): Promise<QueryResult<R>>;
    /**
     * Execute queries inside a managed transaction block
     */
    transact<T>(fn: (client: PoolClient) => Promise<T>): Promise<T>;
  }
}

// 2. Merge the plugin types into the global Fastify Instance interface
declare module 'fastify' {
  interface FastifyInstance {
    pg: import('@fastify/postgres').PostgresPluginObject;
  }
}

declare module 'HTMLElement'{
  interface 
}