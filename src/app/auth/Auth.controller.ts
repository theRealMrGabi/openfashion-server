import { Response, NextFunction } from 'express'

import {
	SignupPayload,
	SigninPayload,
	PasswordService,
	GenerateToken
} from './'
import { User, UserRepository } from '../user'
import { TypedRequestBody } from './../../interface'
import { BadRequestResponse, SuccessResponse } from '../../helpers'

export const Signup = async (
	req: TypedRequestBody<SignupPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password, phoneNumber, firstName, lastName } = req.body

		const userExists = await UserRepository.findOne({
			$or: [{ email }, { phoneNumber }]
		})

		if (userExists) {
			return BadRequestResponse({
				res,
				statusCode: 422,
				message: 'Unable to process request. Try changing details'
			})
		}

		const user = new User({
			email,
			password,
			phoneNumber,
			firstName,
			lastName
		})
		await UserRepository.create(user)

		await user.save()

		return SuccessResponse({
			res,
			statusCode: 201,
			message: 'Signup successful'
		})
	} catch (error) {
		BadRequestResponse({
			res,
			statusCode: 400,
			message: 'Signup failed'
		})
		return next(error)
	}
}

export const Signin = async (
	req: TypedRequestBody<SigninPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body

		const user = await UserRepository.findOne({ email })

		if (!user) {
			return BadRequestResponse({
				res,
				statusCode: 403,
				message: 'Invalid credentials'
			})
		}

		if (user.access === 'revoked') {
			return BadRequestResponse({
				res,
				statusCode: 403,
				message: 'Your access to the platform has been revoked'
			})
		}

		const validPassword = await PasswordService.compare(password, user.password)

		if (!validPassword) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Invalid credentials'
			})
		}

		return SuccessResponse({
			res,
			statusCode: 200,
			message: 'Signin successful',
			data: {
				user,
				token: GenerateToken(user)
			}
		})
	} catch (error) {
		BadRequestResponse({
			res,
			statusCode: 400,
			message: 'Signin failed'
		})
		return next(error)
	}
}
