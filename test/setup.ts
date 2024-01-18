import mongoose from 'mongoose'
import Redis from 'ioredis-mock'

const redisClient = new Redis()

beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_URI!, {})
})

beforeEach(async () => {
	jest.clearAllMocks()

	const collections = await mongoose.connection.db.collections()

	for (const collection of collections) {
		await collection.deleteMany({})
	}
})

afterEach((done) => {
	redisClient.flushall().then(() => done())
	redisClient.quit()
})

afterAll(async () => {
	await mongoose.connection.close()
	await mongoose.disconnect()
	await redisClient.quit()
})

jest.mock('postmark', () => ({
	ServerClient: jest.fn(() => ({
		sendEmail: jest.fn()
	}))
}))
