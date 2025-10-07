import Redis from 'ioredis'

const redis = new Redis({
	host: process.env.REDIS_HOST || 'localhost',
	port: Number(process.env.REDIS_PORT || 6379),
	password: process.env.REDIS_PASSWORD || undefined,
})

redis.on('connect', () => console.log('Connected to yape redis'))
redis.on('error', (err: unknown) => console.error('yape redis error:', err))

export default redis
