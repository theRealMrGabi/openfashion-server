import mongoose from 'mongoose'
import { Redis } from 'ioredis'

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

afterAll(async () => {
	await mongoose.connection.close()
	await mongoose.disconnect()

	await new Promise<void>((resolve) => {
		redisClient.quit(() => {
			resolve()
		})
	})
})
