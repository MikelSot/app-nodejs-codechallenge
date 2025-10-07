export interface Config {
	env: string
	app: {
		port: number
		host: string
	}
	postgres: {
		url: string
		name: string
	}
	fastify: {
		rateLimitMaxConnections: number
		rateLimitTimeWindowMinute: number
	}
}

export default {
	env: process.env.ENV ?? 'development',
	app: {
		port: Number(process.env.PORT),
		host: process.env.HOST,
	},
	postgres: {
		url: process.env.DB_URL,
		name: process.env.DB_NAME,
	},
	fastify: {
		rateLimitMaxConnections: Number(process.env.RATE_LIMIT_QTY_MAX_CONNECTIONS),
		rateLimitTimeWindowMinute: Number(
			process.env.RATE_LIMIT_TIME_WINDOW_MINUTES,
		),
	},
} as Config
