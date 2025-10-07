import type AppContext from 'bootstrap/app-context'
import HealthController from 'presentation/rest/controllers/health.controller'

async function healthRoute({ app }: AppContext) {
	const controller = new HealthController()

	app.get('/health', controller.health)
}

export default healthRoute
