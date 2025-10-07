import { AsyncLocalStorage } from 'node:async_hooks'

import { v4 as uuidV4 } from 'uuid'

class Trace {
	private readonly asyncLocalStorage: AsyncLocalStorage<{ traceId: string }>

	constructor() {
		this.asyncLocalStorage = new AsyncLocalStorage()
	}

	set(uuid: string | null | undefined, cb: () => unknown) {
		try {
			const traceId = uuid ?? uuidV4().replace(/-/g, '')

			this.asyncLocalStorage.run({ traceId }, cb)
		} catch (error) {
			console.error('Error al establecer el traceId:', error)
		}
	}

	id(): string {
		const store = this.asyncLocalStorage.getStore()

		return store?.traceId ?? 'no-trace-id'
	}
}

export default Trace
