import { Kafka, logLevel } from 'kafkajs'

export const kafka = new Kafka({
	clientId: process.env.KAFKA_CLIENT_ID || 'anti-fraud',
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
