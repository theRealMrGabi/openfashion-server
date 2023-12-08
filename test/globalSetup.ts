import { MongoMemoryServer } from 'mongodb-memory-server'

declare global {
	// eslint-disable-next-line no-var
	var mongo: MongoMemoryServer
}

export default async () => {
	const mongo = await MongoMemoryServer.create()
	global.mongo = mongo
	process.env.MONGO_URI = mongo.getUri()
}
