import pino from 'pino'
import pretty from 'pino-pretty'

import type { Config } from 'bootstrap/config'
import config from 'bootstrap/config'

function createLogger(config: Config) {
	if (config.env === 'development') {
		const stream = pretty({
			colorize: true,
			singleLine: true,
			translateTime: 'yyyy-mm-dd HH:MM:ss',
			ignore: 'hostname',
		})

		return pino(stream)
	}

	return pino()
}

const logger = createLogger(config)

export { logger }
