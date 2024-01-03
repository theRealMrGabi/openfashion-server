import crypto from 'crypto'
import mongoose from 'mongoose'

export const generateSecureKey = () => crypto.randomBytes(32).toString('hex')

export const isValidMongooseObjectId = (id: string) => {
	return mongoose.Types.ObjectId.isValid(id)
}

export const isNotTestEnvironment = process.env.NODE_ENV !== 'test'

export * from './emails'
