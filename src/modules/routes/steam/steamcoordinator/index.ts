import fp from 'fastify-plugin';
const { STEAM_USER, STEAM_PASSWORD } = require('../../../../endpoints.config');

export default fp(async (server, opts, next) => {
    server.route({
      url: "/steam/scg/:id",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (request, reply) => {
      }
    });
    next();
});