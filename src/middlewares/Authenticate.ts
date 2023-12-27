import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { BadRequestResponse } from '../helpers'
import { DecryptedUserToken } from './../interface'
import config from '../config'
import { redisClient } from '../startup'

export const Authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const AuthenticationError = () => {
		return BadRequestResponse({
			res,
			message: 'Authentication failed',
			statusCode: 403
		})
	}

	try {
		const authorization = req.headers['authorization']?.split(' ')

		if (authorization![0] !== 'Bearer') AuthenticationError()

		const token = authorization![1]
		if (!token) AuthenticationError()

		const isLoggedOut = await redisClient.get(token)
		if (isLoggedOut) AuthenticationError()

		jwt.verify(token, config.JWT_SECRET, (err, decode) => {
			if (err) {
				return AuthenticationError()
			} else {
				req.user = decode as DecryptedUserToken

				next()
			}
		})
	} catch (error) {
		return AuthenticationError()
	}
}
