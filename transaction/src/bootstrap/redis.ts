import Redis from 'ioredis'

const newRedis = () => {
	const client = new Redis({
		host: process.env.REDIS_HOST || 'localhost',
		port: Number(process.env.REDIS_PORT || 6379),
		password: process.env.REDIS_PASSWORD || undefined,
	})

	client.on('connect', () => console.log('Connected to yape redis'))
	client.on('error', (err: unknown) => console.error('yape redis error:', err))

	return client
}

export default newRedis
