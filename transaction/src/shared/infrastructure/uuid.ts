import { v4 as uuidV4 } from 'uuid'

export const UUID = (): string => {
	return uuidV4()
}
