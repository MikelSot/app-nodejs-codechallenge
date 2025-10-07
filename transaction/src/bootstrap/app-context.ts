import type { FastifyInstance } from 'fastify'

import type Trace from 'shared/infrastructure/trace/trace'

class AppContext {
	constructor(
		public readonly app: FastifyInstance,
		public readonly trace: Trace,
	) {
		this.app = app
		this.trace = trace
	}
}

export default AppContext
