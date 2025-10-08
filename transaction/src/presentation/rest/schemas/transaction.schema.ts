import { z } from 'zod'

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>
export type FindTransactionSchema = z.infer<typeof findTransactionSchema>

export const createTransactionSchema = z.object({
	accountExternalIdDebit: z
		.uuidv4('Debe ser un GUID (v4) válido')
		.describe('ID externo de la cuenta de débito'),
	accountExternalIdCredit: z
		.uuidv4('Debe ser un GUID (v4) válido')
		.describe('ID externo de la cuenta de crédito'),
	transferTypeId: z
		.number()
		.int()
		.positive('Debe ser un número entero positivo')
		.describe('ID del tipo de transferencia'),
	value: z
		.number()
		.positive('El valor debe ser mayor a 0')
		.describe('Monto de la transacción'),
})

export const findTransactionSchema = z.object({
	transactionExternalId: z
		.uuidv4('Debe ser un GUID(v4) válido')
		.describe('ID externo de la transacción'),
})

export const transactionResponseSchema = z.object({
	code: z.number().int().describe('HTTP status code'),
	message: z.string().describe('Response message'),
	data: z.object({
		transactionExternalId: z.uuidv4(),
		transactionType: z.object({
			name: z.string(),
		}),
		transactionStatus: z.object({
			name: z.enum(['pending', 'approved', 'rejected']),
		}),
		value: z.number(),
		createdAt: z.date(),
	}),
})

export const errorSchema = z.object({
	code: z.number(),
	message: z.string(),
})
