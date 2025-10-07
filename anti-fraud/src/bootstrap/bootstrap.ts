import AppContext from 'bootstrap/app-context'
import config from 'bootstrap/config'
import httpServer from 'bootstrap/fastify'
import Trace from 'shared/infrastructure/trace/trace'

const run = async () => {
	try {
		const trace = new Trace()
		const fastify = await httpServer(trace)

		new AppContext(fastify, trace)

		await fastify.listen({ port: config.app.port, host: config.app.host })
		fastify.log.info(`server listening on ${fastify.server.address()}`)
	} catch (error) {
		console.error('Error app initialization:', error)
		process.exit(1)
	}
}

export default run
