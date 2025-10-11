export interface Event<T = unknown> {
	id: string
	type: string
	data: T
	timestamp: Date
}

export interface EventHeaders {
	traceId: string
	eventType: string
}

export enum EventType {
	TRACE_ID = 'traceId',
	EVENT_TYPE = 'eventType',
}
