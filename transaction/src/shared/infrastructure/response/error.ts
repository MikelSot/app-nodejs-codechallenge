import { ServerResponse } from 'shared/infrastructure/response/response'
import { HTTP_STATUS } from 'shared/infrastructure/response/status'

export class InternalServerErrorResponse extends ServerResponse {
	constructor(message = 'Internal Server Error') {
		super()
		this.code = HTTP_STATUS.INTERNAL_SERVER_ERROR
		this.message = message
	}
}

export class ErrorResponse extends ServerResponse {
	constructor(
		message = 'Error',
		code = HTTP_STATUS.INTERNAL_SERVER_ERROR,
		data?: unknown,
	) {
		super()
		this.code = code
		this.message = message
		this.data = data
	}
}
