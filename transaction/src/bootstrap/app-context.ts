import type { FastifyInstance } from 'fastify'
import type Redis from 'ioredis'
import type { Kafka } from 'kafkajs'

import type Trace from 'shared/infrastructure/trace/trace'

class AppContext {
	constructor(
		public readonly app: FastifyInstance,
		public readonly trace: Trace,
		public readonly kafka: Kafka,
		public readonly redis: Redis,
	) {
		this.app = app
		this.trace = trace
		this.kafka = kafka
		this.redis = redis
	}
}

export default AppContext
