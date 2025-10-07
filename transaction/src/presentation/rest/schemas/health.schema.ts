export const healthSchema = {
	response: {
		200: {
			type: 'object',
			properties: {
				uptime: { type: 'number', example: 30.0309835 },
				message: { type: 'string', example: 'Ok' },
				date: {
					type: 'string',
					format: 'date-time',
					example: '2025-10-07T10:30:00.000Z',
				},
			},
		},
	},
}
