import fp from 'fastify-plugin';
const axios = require('axios');
const { STEAM_API_KEY, STEAM_USER_STATS, STEAM_CSGO_APPID } = require('../../../../endpoints.config');

export default fp(async (server, opts, next) => {
    server.route({
      url: "/steam/stats/:id",
      logLevel: "warn",
      method: ["GET", "HEAD"],
      handler: async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST");
        const _id = request.params.id;
        const _url =  `${STEAM_USER_STATS}?appid=${STEAM_CSGO_APPID}&key=${STEAM_API_KEY}&steamid=${_id}`;
        axios.get(_url)
        .then(response => {
          return reply.send({stats: response.data.playerstats.stats})
        })
        .catch(error => {
          console.log(error);
        });
      }
    });
    next();
});