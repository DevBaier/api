import fp from 'fastify-plugin';
import {createContainer} from '../../../../Util/dockerUtil';

export default fp(async (server, opts, next) => {
  server.route({
    url: "/build/docker",
    logLevel: "warn",
    method: ["POST", "HEAD"],
    handler: async (request, reply) => {
      createContainer(request.body.repository.full_name, request.body.repository.name);
      return reply.send({ date: new Date(), works: true });
    }
  });
  next();
});