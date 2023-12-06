import { connectDB } from './mongoose'

export const Startup = () => {
	connectDB()
}
