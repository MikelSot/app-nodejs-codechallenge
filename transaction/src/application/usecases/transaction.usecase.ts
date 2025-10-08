import type TransactionCommand from 'application/command/transaction.command'
import TransactionMapper from 'application/mapper/transaction.mapper'
import type AppContext from 'bootstrap/app-context'
import { TOPICS } from 'bootstrap/kafka'
import Transaction from 'domain/entities/transaction'
import type { Event } from 'domain/event/event'
import type PublisherEvent from 'domain/event/publisher.event'
import type { TransactionRepository } from 'domain/repositories/transaction.repository'
import type CacheService from 'domain/service/cache.service'
import { logger } from 'shared/infrastructure/logger'
import { ErrorResponse } from 'shared/infrastructure/response/error'
import { HTTP_STATUS } from 'shared/infrastructure/response/status'

class TransactionUseCase {
	constructor(
		private readonly context: AppContext,
		private readonly transaction: TransactionRepository,
		private readonly cache: CacheService,
		private readonly publisher: PublisherEvent,
		private readonly dlq: PublisherEvent,
	) {}

	async create(command: TransactionCommand): Promise<Transaction> {
		try {
			const tx = TransactionMapper.toDomain(command)
			await this.transaction.save(tx)

			await this.cache.set(
				`tx::${tx.transactionExternalId}`,
				JSON.stringify(tx),
				43200,
			)

			const event: Event = {
				id: tx.transactionExternalId,
				type: `${TOPICS.TRANSACTIONS}.created`,
				data: tx,
				timestamp: new Date(),
			}

			await this.publisher.publish(TOPICS.TRANSACTIONS, event)

			return tx
		} catch (error) {
			const tx = TransactionMapper.toDomain(command)

			logger.error({
				class: 'TransactionUseCase',
				function: 'create',
				data: { error: error },
				traceId: this.context.trace.id(),
			})

			const event: Event = {
				id: tx.transactionExternalId,
				type: `${TOPICS.DLQ}.created`,
				data: tx,
				timestamp: new Date(),
			}

			await this.dlq.publish(TOPICS.DLQ, event)

			throw new ErrorResponse(
				'Error creating transaction',
				HTTP_STATUS.SERVICE_UNAVAILABLE,
			)
		}
	}

	async update(id: string, status: 'approved' | 'rejected'): Promise<void> {
		const tx = await this.transaction.findById(id)
		if (!tx) {
			throw new Error('Transaction not found')
		}

		if (status === 'approved') {
			tx.status = 'approved'
		} else {
			tx.status = 'rejected'
		}

		tx.updatedAt = new Date()

		await this.transaction.update(tx)
		logger.info({
			class: 'TransactionUseCase',
			function: 'update',
			msg: `Transaction ${id} updated to ${status}`,
			traceId: this.context.trace.id(),
		})

		await this.cache.set(`tx::${id}`, JSON.stringify(tx), 43200)
	}

	async findById(id: string): Promise<Transaction | null> {
		const cache = await this.cache.get(`tx:${id}`)
		if (cache) {
			const data = JSON.parse(cache)

			logger.info({
				class: 'TransactionUseCase',
				function: 'findById',
				msg: `Transaction ${id} found in cache`,
				traceId: this.context.trace.id(),
			})

			return new Transaction(data)
		}

		const transaction = await this.transaction.findById(id)
		if (!transaction) {
			throw new ErrorResponse('Transaction not found', HTTP_STATUS.NOT_FOUND)
		}

		await this.cache.set(`tx::${id}`, JSON.stringify(transaction), 43200)

		return transaction
	}
}

export default TransactionUseCase
