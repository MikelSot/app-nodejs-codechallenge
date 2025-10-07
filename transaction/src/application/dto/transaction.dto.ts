class TransactionDto {
	transactionExternalId: string
	transactionType: {
		name: string
	}
	transactionStatus: {
		name: string
	}
	value: number
	createdAt: Date

	constructor(data: TransactionDto) {
		this.transactionExternalId = data.transactionExternalId
		this.transactionType = data.transactionType
		this.transactionStatus = data.transactionStatus
		this.value = data.value
		this.createdAt = data.createdAt
	}
}

export default TransactionDto
