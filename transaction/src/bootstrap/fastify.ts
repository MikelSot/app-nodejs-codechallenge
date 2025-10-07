import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify, { type FastifyInstance } from 'fastify'
import type { LoggerOptions } from 'pino'

import config from 'bootstrap/config'
import type Trace from 'shared/infrastructure/trace/trace'

async function httpServer(trace: Trace): Promise<FastifyInstance> {
	const app = fastify({
		logger: loggerConfig[config.env] ?? true,
		ignoreTrailingSlash: true,
		trustProxy: true,
	})

	app.addHook('onRequest', (request, _reply, done) => {
		const traceId = request.headers['x-trace-id'] as string
		trace.set(traceId ?? undefined, done)
	})

	await app.register(fastifyCors, {
		origin: false,
	})
	await app.register(fastifyCompress, {
		encodings: ['gzip', 'deflate'],
	})
	await app.register(fastifyHelmet, { contentSecurityPolicy: false })
	await app.register(fastifyFormBody)

	await app.register(fastifyRateLimit, {
		global: true,
		max: config.fastify.rateLimitMaxConnections,
		timeWindow: config.fastify.rateLimitTimeWindowMinute * (1000 * 60), // 15 minutes
		keyGenerator(req) {
			return (req.headers['x-real-ip'] ||
				req.headers['x-forwarded-for'] ||
				req.headers['x-client-ip'] ||
				req.ip) as string
		},
	})

	return app
}

const loggerConfig: { [key: string]: LoggerOptions | boolean } = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'SYS:standard',
				ignore: 'pid,hostname',
				colorize: true,
				singleLine: true,
			},
		},
		level: 'info',
	},
	production: true,
	test: false,
}

export default httpServer
