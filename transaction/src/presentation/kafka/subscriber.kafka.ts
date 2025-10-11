import type TransactionUseCase from 'application/usecases/transaction.usecase'
import type Transaction from 'domain/entities/transaction'
import type { Event, EventHeaders } from 'domain/event/event'
import { logger } from 'shared/infrastructure/logger'

class SubscriberKafka {
	constructor(private readonly useCase: TransactionUseCase) {}

	async handle(event: Event<Transaction>, headers: EventHeaders) {
		logger.info({
			class: 'SubscriberKafka',
			function: 'handle',
			msg: 'Received event',
		})

		try {
			if (headers.eventType !== 'transactions.updated') {
				logger.warn({
					class: 'SubscriberKafka',
					function: 'handle',
					msg: `Unhandled event type: ${headers.eventType}`,
					traceId: headers.traceId,
				})

				return
			}

			const { transactionExternalId: id, status } = event.data
			const result = await this.useCase.update(id, status)

			logger.info({
				class: 'SubscriberKafka',
				function: 'handle',
				msg: `UserUpdated event handled successfully for eventId: ${headers.eventType}`,
				traceId: headers.traceId,
			})

			return result
		} catch (error) {
			logger.error({
				class: 'SubscriberKafka',
				function: 'handle',
				msg: 'Error handling event',
				traceId: headers.traceId,
			})

			throw error
		}
	}
}

export default SubscriberKafka
