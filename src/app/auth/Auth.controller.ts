import { Response, NextFunction } from 'express'

import { TypedRequestBody, UserInterface } from './../../interface'
import { User, UserRepository } from '../user'
import { BadRequestResponse, SuccessResponse } from '../../helpers'

export const Signup = async (
	req: TypedRequestBody<UserInterface>,
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
				message: 'Unable to process request. Try changing user details'
			})
		}

		const userObj = { email, password, phoneNumber, firstName, lastName }

		// const user = new User(req.body)
		const user = new User(userObj)
		await UserRepository.create(user)

		//todo Send Welcome email
		//todo Send Verification email

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
