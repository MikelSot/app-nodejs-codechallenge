import moment from 'moment-timezone'

const TIME_ZONE = 'America/Lima'

export enum TIME {
	DATE_TIME = 'YYYY-MM-DD HH:mm:ss',
}

export const dateTime = (): string => {
	return moment().tz(TIME_ZONE).format(TIME.DATE_TIME)
}
