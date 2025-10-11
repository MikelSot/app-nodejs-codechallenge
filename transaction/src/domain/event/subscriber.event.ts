import type { Event } from 'domain/event/event'

interface SubscriberEvent {
	subscribe(
		topic: string,
		handler: (event: Event) => Promise<void>,
	): Promise<void>

	start(): Promise<void>

	stop(): Promise<void>
}

export default SubscriberEvent
