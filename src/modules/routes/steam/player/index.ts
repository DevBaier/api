import fp from 'fastify-plugin';
const axios = require('axios');
const { STEAM_USER_SUMMARY, STEAM_API_KEY  } = require('../../../../endpoints.config');

export default fp(async (server, opts, next) => {
    server.route({
      url: "/steam/player/:id",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST");
        const _id = request.params.id;
        const _url =  `${STEAM_USER_SUMMARY}?key=${STEAM_API_KEY}&steamids=${_id}`;
        axios.get(_url)
        .then(response => {
          return reply.send({player: response.data.response.players})
        })
        .catch(error => {
          console.log(error);
        });
      }
    });
    next();
});