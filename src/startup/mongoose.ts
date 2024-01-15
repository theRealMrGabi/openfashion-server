import mongoose from 'mongoose'
import config from '../config'

const debugDB =
	config.isProduction || process.env.NODE_ENV === 'test' ? false : true
mongoose.set('debug', debugDB)

export const connectDB = async () => {
	try {
		await mongoose.connect(config.MONGO_URI)
		console.log(`💚 ${config.APP_NAME} MongoDB connected 💚`)
	} catch (error) {
		console.error(`🅱️ ${config.APP_NAME} MongoDB connection failed 🅱️`, error)
		process.exit(1)
	}
}
