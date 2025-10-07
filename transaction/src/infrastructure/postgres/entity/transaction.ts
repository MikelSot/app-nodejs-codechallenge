import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'

@Entity('transactions')
export class Transaction {
	@Column({
		type: 'uuid',
		name: 'transaction_external_id',
		unique: true,
	})
	transactionExternalId!: string

	@Column({
		type: 'uuid',
		name: 'account_external_id_debit',
	})
	accountExternalIdDebit!: string

	@Column({
		type: 'uuid',
		name: 'account_external_id_credit',
	})
	accountExternalIdCredit!: string

	@Column({
		type: 'int',
		name: 'transfer_type_id',
	})
	transferTypeId!: number

	@Column({
		type: 'decimal',
		precision: 15,
		scale: 2,
	})
	value!: number

	@Column({
		type: 'varchar',
		length: 20,
	})
	status!: string

	@CreateDateColumn({
		name: 'created_at',
		type: 'timestamp',
	})
	createdAt!: Date

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamp',
	})
	updatedAt!: Date
}
