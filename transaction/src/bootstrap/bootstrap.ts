import AppContext from 'bootstrap/app-context'
import config from 'bootstrap/config'
import { newDb } from 'bootstrap/database'
import httpServer from 'bootstrap/fastify'
import { createTopics, newKafka } from 'bootstrap/kafka'
import newRedis from 'bootstrap/redis'
import fastifySwagger from 'bootstrap/swagger'
import routes from 'presentation/rest/routes/routes'
import Trace from 'shared/infrastructure/trace/trace'

const run = async () => {
	try {
		const trace = new Trace()
		const fastify = await httpServer(trace)

		await newDb()
		const redis = newRedis()

		await createTopics()

		const kafka = newKafka()

		const context = new AppContext(fastify, trace, kafka, redis)

		await fastifySwagger(context)

		await routes(context)

		await fastify.listen({ port: config.app.port, host: config.app.host })
		fastify.log.info(`server listening on ${fastify.server.address()}`)
	} catch (error) {
		console.error('Error app initialization:', error)
		process.exit(1)
	}
}

export default run
