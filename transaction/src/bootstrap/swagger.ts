import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { createJsonSchemaTransform } from 'fastify-type-provider-zod'

import type AppContext from 'bootstrap/app-context'

const fastifySwagger = async ({ app }: AppContext) => {
	await app.register(swagger, {
		openapi: {
			info: {
				title: 'transaction Yape challenge',
				description: 'Documentación de la API',
				version: '1.0.0',
			},
			servers: [{ url: 'http://localhost:3000' }],
			tags: [
				{ name: 'transactions', description: 'Operaciones con transacciones' },
			],
		},
		transform: createJsonSchemaTransform({}),
	})

	await app.register(swaggerUI, {
		routePrefix: '/docs',
		uiConfig: {
			docExpansion: 'full',
			deepLinking: true,
		},
		staticCSP: true,
	})

	app.log.info('Swagger UI available at /docs')
}

export default fastifySwagger
