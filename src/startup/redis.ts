import { Redis } from 'ioredis'
import RedisMock from 'ioredis-mock'

import config from '../config'
import { isNotTestEnvironment } from '../utils'

const log = (message: string) => {
	if (process.env.NODE_ENV !== 'test') return console.log(message)
}

const client = isNotTestEnvironment
	? new Redis(config.REDIS_URL)
	: new RedisMock()

client.on('connect', () => {
	isNotTestEnvironment &&
		log(`🍀 ${config.APP_NAME} Client connected to redis ✅`)
})

client.on('ready', () => {
	isNotTestEnvironment &&
		log(`🍀 ${config.APP_NAME} Client connected to redis and ready to use ✅`)
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
