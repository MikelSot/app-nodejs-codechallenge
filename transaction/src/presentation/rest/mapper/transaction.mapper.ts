import type TransactionDto from 'application/dto/transaction.dto'
import type Transaction from 'domain/entities/transaction'

class TransactionMapper {
	static toResponse(data: Transaction): TransactionDto {
		return {
			transactionExternalId: data.transactionExternalId,
			transactionType: {
				name: 'debit',
			},
			transactionStatus: {
				name: data.status,
			},
			value: data.value,
			createdAt: data.createdAt,
		}
	}
}

export default TransactionMapper
