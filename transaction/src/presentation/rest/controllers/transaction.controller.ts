import type TransactionCommand from 'application/command/transaction.command'
import type TransactionUseCase from 'application/usecases/transaction.usecase'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { InternalServerErrorResponse } from 'shared/infrastructure/response/error'
import {
	ServerResponse,
	SuccessCreatedResponse,
	SuccessResponse,
} from 'shared/infrastructure/response/response'

class TransactionController {
	constructor(private readonly useCase: TransactionUseCase) {}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const payload = request.body as TransactionCommand

			const transaction = await this.useCase.create(payload)

			const response = new SuccessCreatedResponse(transaction)

			return reply.status(response.code).send(response)
		} catch (error) {
			let response = new InternalServerErrorResponse()
			if (error instanceof ServerResponse) response = error

			return reply.status(response.code).send(response)
		}
	}

	async findById(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { transactionExternalId: id } = request.params as {
				transactionExternalId: string
			}

			const transaction = await this.useCase.findById(id)
			const response = new SuccessResponse(transaction)

			return reply.status(response.code).send(response)
		} catch (error) {
			let response = new InternalServerErrorResponse()
			if (error instanceof ServerResponse) response = error

			return reply.status(response.code).send(response)
		}
	}
}

export default TransactionController
