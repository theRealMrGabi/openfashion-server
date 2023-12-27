import { connectDB } from './mongoose'
import './redis'

export const Startup = () => {
	connectDB()
}

export * from './redis'
