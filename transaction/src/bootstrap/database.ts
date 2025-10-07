import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { Transaction } from 'infrastructure/postgres/entity/transaction'

const dataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: Number.parseInt(process.env.DB_PORT || '5432'),
	username: process.env.DB_USER || 'yape',
	password: process.env.DB_PASSWORD || 'secret',
	database: process.env.DB_NAME || 'transaction',
	synchronize: false,
	entities: [Transaction],
	extra: {
		max: 50,
		min: 5,
	},
})

export const db = async ()  => {
	try {
		await dataSource.initialize()
		console.log('Database connection')
	} catch (error) {
		console.error('Database connection failed:', error)

		throw error
	}
}

export default db
