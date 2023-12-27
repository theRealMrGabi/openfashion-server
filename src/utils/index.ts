import crypto from 'crypto'
import mongoose from 'mongoose'

export const generateSecureKey = () => crypto.randomBytes(32).toString('hex')

export const isValidMongooseObjectId = (id: string) => {
	return mongoose.Types.ObjectId.isValid(id)
}

export * from './emails'
