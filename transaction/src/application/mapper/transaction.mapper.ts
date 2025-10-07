import type TransactionCommand from 'application/command/transaction.command'
import type Transaction from 'domain/entities/transaction'
import { dateTime } from 'shared/infrastructure/date'
import { UUID } from 'shared/infrastructure/uuid'

class TransactionMapper {
	static toDomain(data: TransactionCommand): Transaction {
		return {
			transactionExternalId: UUID(),
			accountExternalIdDebit: data.accountExternalIdDebit,
			accountExternalIdCredit: data.accountExternalIdCredit,
			transferTypeId: 1,
			value: data.value,
			status: 'pending',
			createdAt: new Date(dateTime()),
		}
	}
}

export default TransactionMapper
