class Transaction {
	id: string
	transactionExternalId: string
	accountExternalIdDebit: string
	accountExternalIdCredit: string
	transferTypeId: number
	value: number
	status: string
	createdAt: Date
	updatedAt: Date

	constructor(data: Transaction) {
		this.id = data.id
		this.transactionExternalId = data.transactionExternalId
		this.accountExternalIdDebit = data.accountExternalIdDebit
		this.accountExternalIdCredit = data.accountExternalIdCredit
		this.transferTypeId = data.transferTypeId
		this.value = data.value
		this.status = data.status
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}
}

export default Transaction
