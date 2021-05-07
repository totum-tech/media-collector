import makeServer from 'fastify';
import logger from "./logger";

const server = makeServer({ logger: true })

export async function startServer({ databasePath }) {

    server.get('/media', async (request, reply) => {
        return { databasePath }
    });

    try {
        await server.listen(3000);
    } catch (e) {
        logger.error(e.message);
    }
}

export default startServer
