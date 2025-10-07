class TransactionCommand {
	accountExternalIdDebit: string
	accountExternalIdCredit: string
	transferType: string
	value: number

	constructor(data: TransactionCommand) {
		this.accountExternalIdDebit = data.accountExternalIdDebit
		this.accountExternalIdCredit = data.accountExternalIdCredit
		this.transferType = data.transferType
		this.value = data.value
	}
}

export default TransactionCommand
