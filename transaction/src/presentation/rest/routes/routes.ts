import type AppContext from 'bootstrap/app-context'
import healthRoute from 'presentation/rest/routes/health.route'

async function routes(context: AppContext) {
	// H
	await healthRoute(context)
}

export default routes
