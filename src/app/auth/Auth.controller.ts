import { Response, NextFunction } from 'express'

import { SignupPayload } from './'
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

// export const Signin = async (
// 	req: TypedRequestBody<>,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 	} catch (error) {}
// }
