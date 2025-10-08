import type AppContext from 'bootstrap/app-context'
import healthRoute from 'presentation/rest/routes/health.route'
import transactionRoute from 'presentation/rest/routes/transaction.route'

async function routes(context: AppContext) {
	// H
	await healthRoute(context)

	// T
	await transactionRoute(context)
}

export default routes
