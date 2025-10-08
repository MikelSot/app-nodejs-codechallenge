import { z } from 'zod'

export const createTransactionZod = z.object({
	accountExternalIdDebit: z.uuidv4('Debe ser un GUID (v4) válido'),
	accountExternalIdCredit: z.uuidv4('Debe ser un GUID (v4) válido'),
	transferTypeId: z
		.number()
		.int()
		.positive('Debe ser un número entero positivo'),
	value: z.number().positive('El valor debe ser mayor a 0'),
})

export const findTransactionZod = z.object({
	transactionExternalId: z.uuidv4('Debe ser un GUID(v4) válido'),
})
