import crypto from 'crypto'
import mongoose from 'mongoose'

export const generateSecureKey = () => crypto.randomBytes(32).toString('hex')

export const isValidMongooseObjectId = (id: string) => {
	return mongoose.Types.ObjectId.isValid(id)
}

export const isNotTestEnvironment = process.env.NODE_ENV !== 'test'

export const isObjectEmpty = (obj: object) => {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) return false
	}
	return true
}

export * from './emails'
export { generateOTPCode } from './generateOTPCode'
export { redisKeys } from './redisKeys'
