import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import 'joi-extract-type'

import { BadRequestResponse } from '../../helpers'

export const SignupSchema = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const schema = {
		body: Joi.object({
			email: Joi.string().email().trim().required(),
			password: Joi.string()
				.required()
				.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])(.{8,})$/)
				.message(
					'Password must contain the following lowercase, uppercase, number, special character and must be minumum of 8 characters'
				),
			firstName: Joi.string().trim().required(),
			lastName: Joi.string().trim().required(),
			phoneNumber: Joi.string()
				.trim()
				.required()
				.regex(/^([+234]{4})[0-9]{10}$/)
				.message('Phone number must match this format +2348023456789')
		})
	}

	const { error } = schema.body.validate(req.body)

	if (error) {
		return BadRequestResponse({
			res,
			statusCode: 400,
			message: error.details[0].message.replace(/['"]/g, '')
		})
	}

	return next()
}
