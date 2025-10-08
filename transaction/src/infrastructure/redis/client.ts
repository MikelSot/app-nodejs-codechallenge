import type { Redis } from 'ioredis'

import type CacheService from 'domain/service/cache.service'
import { logger } from 'shared/infrastructure/logger'

export class RedisCache implements CacheService {
	constructor(private readonly redis: Redis) {}

	async set(key: string, value: string, ttl: number): Promise<void> {
		logger.info({
			class: 'RedisCache',
			function: 'set',
			msg: `Setting cache key ${key} with TTL ${ttl}`,
		})

		await this.redis.set(key, value, 'EX', ttl)
	}

	async get(key: string): Promise<string | null> {
		logger.info({
			class: 'RedisCache',
			function: 'get',
			msg: `Getting cache key ${key}`,
		})

		return this.redis.get(key)
	}
}

export default RedisCache
