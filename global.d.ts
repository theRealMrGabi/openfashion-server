import { DecryptedUserToken } from './src/interface'

declare global {
	namespace Express {
		interface Request {
			user?: DecryptedUserToken
		}
	}
}
