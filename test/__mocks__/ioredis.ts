import Redis from 'ioredis-mock'

jest.mock('ioredis', () => {
	const Redis = jest.requireActual('ioredis')

	return {
		...jest.requireActual('ioredis'),
		Redis: jest.fn(() => new Redis())
	}
})

const client = new Redis()

export { client as redisClient }
