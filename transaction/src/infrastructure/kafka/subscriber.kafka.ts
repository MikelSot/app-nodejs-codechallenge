import type { Consumer, IHeaders, Kafka } from 'kafkajs'

import type AppContext from 'bootstrap/app-context'
import { type Event, type EventHeaders, EventType } from 'domain/event/event'
import type SubscriberEvent from 'domain/event/subscriber.event'
import { logger } from 'shared/infrastructure/logger'

class SubscriberKafka implements SubscriberEvent {
	private readonly handlerMap: Map<
		string,
		(event: Event, headers: EventHeaders) => Promise<void>
	> = new Map()

	private readonly consumer: Consumer

	private constructor(
		kafka: Kafka,
		groupId: string,
		private readonly context: AppContext,
	) {
		this.consumer = kafka.consumer({
			groupId,
			retry: {
				maxRetryTime: 30000,
				initialRetryTime: 300,
				retries: 2,
			},
		})
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
		handler: (event: Event, header: EventHeaders) => Promise<void>,
	): Promise<void> {
		this.handlerMap.set(topic, handler)
		await this.consumer.subscribe({ topic, fromBeginning: true })
	}

	async start(): Promise<void> {
		await this.consumer.run({
			eachMessage: async ({ topic, message }) => {
				try {
					const handler = this.handlerMap.get(topic)
					if (!handler || !message.value) {
						logger.warn({
							class: 'SubscriberKafka',
							function: 'start',
							msg: `No handler found for topic ${topic} or message value is null`,
							traceId: this.context.trace.id(),
						})

						return
					}

					if (!message.value) {
						logger.warn({
							class: 'SubscriberKafka',
							function: 'start',
							msg: `Message value is null for topic ${topic}`,
							traceId: this.context.trace.id(),
						})

						return
					}

					const event: Event = JSON.parse(message.value.toString())
					const headers = this.parseHeaders(message.headers)

					await handler(event, headers)
				} catch (error) {
					logger.info({
						class: 'SubscriberKafka',
						function: 'start',
						msg: `Error processing message from topic ${topic}: ${error}`,
						traceId: this.context.trace.id(),
					})
				}
			},
		})
	}

	async stop() {
		await this.consumer.stop()
	}

	private parseHeaders(headers: IHeaders | undefined): EventHeaders {
		if (!headers) return {} as EventHeaders

		return {
			traceId: headers[EventType.TRACE_ID]?.toString() || '',
			eventType: headers[EventType.EVENT_TYPE]?.toString() || 'UNKNOWN',
		}
	}
}

export default SubscriberKafka
