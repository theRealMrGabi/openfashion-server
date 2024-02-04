/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import { Redis } from 'ioredis'
import RedisMock from 'ioredis-mock'

import config from '../config'
import { isNotTestEnvironment } from '../utils'

const log = (message: string) => {
	if (process.env.NODE_ENV !== 'test') return console.log(message)
}

const client = isNotTestEnvironment
	? new Redis(config.REDIS_URL, {
			connectTimeout: 1000,
			maxRetriesPerRequest: 3
	  })
	: new RedisMock()

client.on('connect', async () => {
	await client.ping()
	isNotTestEnvironment &&
		log(`🍀 ${config.APP_NAME} server connected to redis ✅`)
})

client.on('ready', () => {
	isNotTestEnvironment &&
		log(`🍀 ${config.APP_NAME} server connected to redis and ready to use ✅`)
})

client.on('error', (err) => {
	isNotTestEnvironment &&
		log(`🚩 ${config.APP_NAME} redis error ---> ${err.message}`)
	return process.exit(1)
})

client.on('end', () => {
	isNotTestEnvironment && log('🚩 Client disconnected from redis ❌')
})

process.on('SIGINT', () => {
	client.quit()
})

export { client as redisClient }
