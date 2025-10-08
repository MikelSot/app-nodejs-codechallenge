import { dateTime } from 'shared/infrastructure/date'
import { HTTP_STATUS } from 'shared/infrastructure/response/status'

export class ServerResponse<T = unknown> {
	public code: number
	public data: T | undefined
	public errors: unknown
	public message: string
	public date: string

	constructor() {
		this.code = 0
		this.message = ''
		this.date = dateTime()
	}
}

export class SuccessResponse<T = unknown> extends ServerResponse {
	constructor(data: T, message = 'Success', code = HTTP_STATUS.OK) {
		super()
		this.code = code
		this.data = data
		this.message = message
	}
}

export class SuccessCreatedResponse<T = unknown> extends ServerResponse {
	constructor(data: T, message = 'Success') {
		super()
		this.code = HTTP_STATUS.CREATED
		this.data = data
		this.message = message
	}
}
