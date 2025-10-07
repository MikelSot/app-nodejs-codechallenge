import type { Consumer, Kafka } from 'kafkajs'

import type AppContext from 'bootstrap/app-context'
import type { Event } from 'domain/event/event'
import type SubscriberEvent from 'domain/event/subscriber.event'
import { logger } from 'shared/infrastructure/logger'

class SubscriberKafka implements SubscriberEvent {
	private readonly handlerMap: Map<string, (event: Event) => Promise<void>> =
		new Map()

	private readonly consumer: Consumer

	private constructor(
		kafka: Kafka,
		groupId: string,
		private readonly context: AppContext,
	) {
		this.consumer = kafka.consumer({ groupId })
	}

	static async new(
		kafka: Kafka,
		groupId: string,
		context: AppContext,
	): Promise<SubscriberKafka> {
		const publisher = new SubscriberKafka(kafka, groupId, context)
		await publisher.consumer.connect()

		return publisher
	}

	async subscribe(
		topic: string,
		handler: (event: Event) => Promise<void>,
	): Promise<void> {
		this.handlerMap.set(topic, handler)
		await this.consumer.subscribe({ topic, fromBeginning: true })
	}

	async startListening(): Promise<void> {
		await this.consumer.run({
			eachMessage: async ({ topic, message }) => {
				const handler = this.handlerMap.get(topic)
				if (!handler || !message.value) return

				try {
					const event: Event = JSON.parse(message.value.toString())

					await handler(event)
				} catch (error) {
					logger.info({
						class: 'SubscriberKafka',
						function: 'startListening',
						msg: `Error processing message from topic ${topic}: ${error}`,
						traceId: this.context.trace.id(),
					})
				}
			},
		})
	}
}

export default SubscriberKafka
