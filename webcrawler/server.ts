import Fastify from "fastify";
import urlroutes from "./url/routes.js";
import dbConnector from "./db.js";
import dotenv from "dotenv";
import { createUrlRepository } from "./repositories/url.repository.js";
dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(dbConnector);

const urlRepository = createUrlRepository(fastify.db);
fastify.register(urlroutes);

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.listen({ port: 4000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

//TODO: create Crawler factory class and add createUrlRepository and other Repository services.
//TODO: Follow Robot.txt file
//TODO: Automate URL Frontier by adding links found and jumping through the links
