import type AppContext from 'bootstrap/app-context'
import HealthController from 'presentation/rest/controllers/health.controller'
import { healthSchema } from 'presentation/rest/schemas/health.schema'

async function healthRoute({ app }: AppContext) {
	const controller = new HealthController()

	app.get(
		'/health',
		{
			schema: healthSchema,
			config: {
				tags: ['health'],
				summary: 'Health check',
			},
		},
		controller.health,
	)
}

export default healthRoute
