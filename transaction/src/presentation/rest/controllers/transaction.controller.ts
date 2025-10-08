import type TransactionCommand from 'application/command/transaction.command'
import type TransactionUseCase from 'application/usecases/transaction.usecase'
import type { FastifyReply, FastifyRequest } from 'fastify'
import TransactionMapper from 'presentation/rest/mapper/transaction.mapper'
import {
	ErrorResponse,
	InternalServerErrorResponse,
} from 'shared/infrastructure/response/error'
import {
	ServerResponse,
	SuccessCreatedResponse,
	SuccessResponse,
} from 'shared/infrastructure/response/response'
import { HTTP_STATUS } from 'shared/infrastructure/response/status'

class TransactionController {
	constructor(private readonly useCase: TransactionUseCase) {}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const payload = request.body as TransactionCommand

			const transaction = await this.useCase.create(payload)

			const response = new SuccessCreatedResponse(
				TransactionMapper.toResponse(transaction),
			)

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
			if (!transaction) {
				const response = new ErrorResponse(
					'Transaction not found',
					HTTP_STATUS.NOT_FOUND,
				)

				return reply.status(response.code).send(response)
			}

			const response = new SuccessResponse(
				TransactionMapper.toResponse(transaction),
			)

			return reply.status(response.code).send(response)
		} catch (error) {
			let response = new InternalServerErrorResponse()
			if (error instanceof ServerResponse) response = error

			return reply.status(response.code).send(response)
		}
	}
}

export default TransactionController
