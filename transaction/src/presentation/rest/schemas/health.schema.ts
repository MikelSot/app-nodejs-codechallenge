import { z } from 'zod'

export const healthSchema = {
	response: {
		200: z.object({
			uptime: z.number(),
			message: z.string(),
			date: z.date(),
		}),
	},
}
