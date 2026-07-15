import Fastify from "fastify";
import routes from "./url/routes.js"
import dbConnector from "./db.js"
import dotenv from "dotenv";
dotenv.config();
import { drizzle } from 'drizzle-orm/node-postgres';

const fastify = Fastify({
  logger: true
})

fastify.register(dbConnector)
fastify.register(routes)

fastify.get('/', function(request, reply){
    reply.send({ hello: 'world' })
})

fastify.listen({port:4000},function(err,address){
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})