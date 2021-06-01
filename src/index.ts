import fastify, { FastifyInstance } from 'fastify';
import fastifyBlipp from 'fastify-blipp';
import { Server, IncomingMessage, ServerResponse } from 'http';

import buildDockerbRoutes from "./modules/routes/build/docker";
import playerRoutes from "./modules/routes/steam/player";
import scgRoutes from "./modules/routes/steam/steamcoordinator";
import statsRoutes from "./modules/routes/steam/stats";
import statusRoutes from "./modules/routes/status";

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

server.register(fastifyBlipp);
server.register(buildDockerbRoutes);
server.register(scgRoutes);
server.register(statsRoutes);
server.register(playerRoutes);
server.register(statusRoutes);

const start = async () => {
  try {
    await server.listen(5424, "0.0.0.0");
    console.log('Listening on port :5424 🚀 \n')
    server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

start();