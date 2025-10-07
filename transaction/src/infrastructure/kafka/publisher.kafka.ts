import type AppContext from 'bootstrap/app-context'
import type { Event } from 'domain/event/event'
import type PublisherEvent from 'domain/event/publisher.event'
import type { Kafka, Producer } from 'kafkajs'
import { logger } from 'shared/infrastructure/logger'

class PublisherKafka implements PublisherEvent {
	private readonly producer: Producer

	private constructor(
		kafka: Kafka,
		private readonly context: AppContext,
	) {
		this.producer = kafka.producer()
	}

	static async new(kafka: Kafka, context: AppContext): Promise<PublisherKafka> {
		const publisher = new PublisherKafka(kafka, context)
		await publisher.producer.connect()

		return publisher
	}

	async publish(topic: string, event: Event): Promise<void> {
		const message = {
			key: event.id,
			value: JSON.stringify(event),
			headers: { eventType: event.type },
		}

		await this.producer.send({
			topic: topic,
			messages: [message],
		})

		logger.info({
			class: 'PublisherKafka',
			function: 'publish',
			msg: `Event published to topic ${topic}`,
			traceId: this.context.trace.id(),
		})
	}
}

export default PublisherKafka
