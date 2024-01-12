import crypto from 'crypto'
import mongoose from 'mongoose'

export const generateSecureKey = () => crypto.randomBytes(32).toString('hex')

export const generateOTPCode = () => {
	const code = crypto.randomBytes(3).readUIntLE(0, 3) % 1000000
	return code.toString().padStart(6, '0')
}

export const isValidMongooseObjectId = (id: string) => {
	return mongoose.Types.ObjectId.isValid(id)
}

export const isNotTestEnvironment = process.env.NODE_ENV !== 'test'

export * from './emails'
