import type Transaction from 'domain/entities/transaction'
import type TransactionEntity from 'infrastructure/postgres/entity/transaction'

class TransactionMapper {
	static toEntity(data: Transaction): TransactionEntity {
		return {
			transactionExternalId: data.transactionExternalId,
			accountExternalIdDebit: data.accountExternalIdDebit,
			accountExternalIdCredit: data.accountExternalIdCredit,
			transferTypeId: data.transferTypeId,
			value: data.value,
			status: data.status,
			createdAt: data.createdAt,
		}
	}

	static toDomain(data: TransactionEntity): Transaction {
		return {
			transactionExternalId: data.transactionExternalId,
			accountExternalIdDebit: data.accountExternalIdDebit,
			accountExternalIdCredit: data.accountExternalIdCredit,
			transferTypeId: data.transferTypeId,
			value: data.value,
			status: data.status,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		}
	}
}

export default TransactionMapper
