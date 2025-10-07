import type { Redis } from 'ioredis'

import type CacheService from 'domain/service/cache.service'

export class RedisCache implements CacheService {
	constructor(private readonly redis: Redis) {}

	async set(key: string, value: string, ttl: number): Promise<void> {
		await this.redis.set(key, value, 'EX', ttl)
	}

	async get(key: string): Promise<string | null> {
		return this.redis.get(key)
	}
}

export default RedisCache
