import run from 'bootstrap/bootstrap'

run()
	.then(() => {
		console.info('Server started')
	})
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
