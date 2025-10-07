import type { Repository } from 'typeorm'

import db from 'bootstrap/database'
import type Transaction from 'domain/entities/transaction'
import type { TransactionRepository } from 'domain/repositories/transaction.repository'
import TransactionEntity from 'infrastructure/postgres/entity/transaction'
import TransactionMapper from 'infrastructure/postgres/mapper/transaction.mapper'

class TransactionPostgres implements TransactionRepository {
	private readonly repository: Repository<TransactionEntity>

	constructor() {
		this.repository = db.getRepository(TransactionEntity)
	}

	async save(transaction: Transaction): Promise<void> {
		const entity = TransactionMapper.toEntity(transaction)
		await this.repository.save(entity)
	}

	async findById(id: string): Promise<Transaction | null> {
		const entity = await this.repository.findOne({
			where: { transactionExternalId: id },
		})

		if (!entity) {
			return null
		}

		return TransactionMapper.toDomain(entity)
	}

	async update(transaction: Transaction): Promise<void> {
		const entity = TransactionMapper.toEntity(transaction)
		await this.repository.save(entity)
	}
}

export default TransactionPostgres
