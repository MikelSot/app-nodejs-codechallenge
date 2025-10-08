import TransactionUseCase from 'application/usecases/transaction.usecase'
import type AppContext from 'bootstrap/app-context'
import { kafka } from 'bootstrap/kafka'
import redis from 'bootstrap/redis'
import type { FastifyInstance, preHandlerHookHandler } from 'fastify'
import PublisherKafka from 'infrastructure/kafka/publisher.kafka'
import TransactionPostgres from 'infrastructure/postgres/transaction.postgres'
import RedisCache from 'infrastructure/redis/client'
import TransactionController from 'presentation/rest/controllers/transaction.controller'
import {
	type CreateTransactionSchema,
	type FindTransactionSchema,
	createTransactionSchema,
	errorSchema,
	transactionResponseSchema,
} from 'presentation/rest/schemas/transaction.schema'

enum ROUTE {
	PUBLIC_PREFIX = '/v1/transactions',
}

async function transactionRoute(context: AppContext) {
	const controller = await buildTransactionController(context)

	await publicTransactionRoute(context.app, controller, [])
}

async function buildTransactionController(context: AppContext) {
	const db = new TransactionPostgres()
	const cache = new RedisCache(redis)
	const publisher = await PublisherKafka.new(context, kafka)
	const dlq = await PublisherKafka.new(context, kafka)

	const useCase = new TransactionUseCase(context, db, cache, publisher, dlq)

	return new TransactionController(useCase)
}

async function publicTransactionRoute(
	app: FastifyInstance,
	controller: TransactionController,
	middlewares?: preHandlerHookHandler[],
) {
	const endpoints = async (app: FastifyInstance) => {
		app.post<{ Body: CreateTransactionSchema }>(
			'',
			{
				preHandler: middlewares,
				schema: {
					description: 'Create a new transaction',
					body: createTransactionSchema,
					tags: ['transactions'],
					response: {
						201: transactionResponseSchema,
						400: errorSchema,
						503: errorSchema,
					},
				},
			},
			controller.create.bind(controller),
		)

		app.get<{ Params: FindTransactionSchema }>(
			'/:transactionExternalId',
			{
				preHandler: middlewares,
				schema: {
					description: 'Get details transaction by its external ID',
					body: createTransactionSchema,
					tags: ['transactions'],
					response: {
						200: transactionResponseSchema,
						404: errorSchema,
					},
				},
			},
			controller.findById.bind(controller),
		)
	}

	await app.register(endpoints, { prefix: ROUTE.PUBLIC_PREFIX })
}

export default transactionRoute
