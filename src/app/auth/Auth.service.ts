import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import config from '../../config'
import { UserInterface } from '../user'

export class PasswordService {
	static async hash(password: string) {
		const salt = await bcrypt.genSalt(12)
		const hashedPassword = await bcrypt.hash(password, salt)
		return hashedPassword
	}

	static async compare(password: string, hashedPassword: string) {
		const comparedPassword = await bcrypt.compare(password, hashedPassword)
		return comparedPassword
	}
}

const jwtOptions = {
	issuer: config.JWT_ISSUER,
	expiresIn: '72h'
}

export const GenerateToken = (user: UserInterface) =>
	jwt.sign({ id: user.id }, config.JWT_SECRET, jwtOptions)
