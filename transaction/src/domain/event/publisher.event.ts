import type { Event } from 'domain/event/event'

interface PublisherEvent {
	publish(topic: string, event: Event): Promise<void>
}

export default PublisherEvent
