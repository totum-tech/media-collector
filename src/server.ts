import makeServer from 'fastify';
import logger from "./logger";

const server = makeServer({ logger: true })

server.get('/media', async (request, reply) => {

});

const startServer = async () => {
    try {
        await server.listen(3000);
    } catch (e) {
        logger.error(e.message);
    }
}

export default startServer
