import { Kafka, logLevel } from 'kafkajs'

export const newKafka = () =>
	new Kafka({
		clientId: process.env.KAFKA_CLIENT_ID || 'transaction',
		brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
		logLevel: logLevel.INFO,
		retry: {
			initialRetryTime: 300,
			retries: 3,
			maxRetryTime: 30000,
			multiplier: 2,
		},
	})

export const TOPICS = {
	TRANSACTIONS: 'transactions',
	DLQ: 'dlq',
}

export const createTopics = async () => {
	const admin = newKafka().admin()

	try {
		await admin.connect()

		const topics = await admin.listTopics()
		const newTopics = []

		if (!topics.includes(TOPICS.TRANSACTIONS)) {
			newTopics.push({
				topic: TOPICS.TRANSACTIONS,
				numPartitions: 3,
				replicationFactor: 1,
			})
		}

		if (!topics.includes(TOPICS.DLQ)) {
			newTopics.push({
				topic: TOPICS.DLQ,
				numPartitions: 1,
				replicationFactor: 1,
			})
		}

		if (newTopics.length === 0) {
			console.log('Kafka topics already exist')

			return
		}

		await admin.createTopics({
			topics: newTopics,
		})

		console.log(
			'Kafka topics created:',
			newTopics.map((t) => t.topic).join(', '),
		)
	} catch (error) {
		console.error('Error creating Kafka topics:', error)
	} finally {
		await admin.disconnect()
	}
}
