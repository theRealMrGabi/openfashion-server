import { Request, Response, NextFunction } from 'express'

import {
	SignupPayload,
	SigninPayload,
	PasswordService,
	GenerateToken,
	EmailPayload,
	ResetPasswordPayload
} from './'
import { User, UserRepository } from '../user'
import { TypedRequestBody, TypedRequest } from './../../interface'
import { BadRequestResponse, SuccessResponse, MailBuilder } from '../../helpers'
import { welcomeEmail, generateOTPCode, ForgotPasswordEmail } from '../../utils'
import config from '../../config'
import { redisClient } from '../../startup'

//This could be improved on by implementing Mongoose Transaction. So that when an action fails, it rollsback the transaction and doesn't save it into the DB
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

		await new MailBuilder()
			.recipient(email)
			.subject('Welcome to Open-Fashion!')
			.html(
				welcomeEmail({
					recipientName: firstName,
					senderName: config.MAIL_SENDER_NAME
				})
			)
			.send()

		return SuccessResponse({
			res,
			statusCode: 201,
			message: 'Signup successful'
		})
	} catch (error) {
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
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

		if (!user.access) {
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
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

export const Signout = async (req: Request, res: Response) => {
	const SignoutResponse = () => {
		return SuccessResponse({
			res,
			message: 'Signout successful'
		})
	}

	try {
		const { headers, user } = req
		const authorization = headers['authorization']

		if (!authorization) SignoutResponse()

		const token = authorization?.split(' ')[1]
		if (!token) SignoutResponse()

		if (!user) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'User not signed in'
			})
		}

		const {
			exp,
			iat,
			user: { id }
		} = user
		const time = exp - iat

		redisClient.setex(token!, time, id)
		return SignoutResponse()
	} catch (error) {
		if (error instanceof Error) {
			return BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
		}
	}
}

export const ForgotPassword = async (
	req: TypedRequestBody<Pick<SigninPayload, 'email'>>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email } = req.body

		const user = await UserRepository.findOne({ email })

		if (!user) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Invalid credentials'
			})
		}

		if (!user.access) {
			return BadRequestResponse({
				res,
				statusCode: 403,
				message: 'Your access to the platform has been revoked'
			})
		}

		const otpCode = generateOTPCode()

		await redisClient.setex(`${email}-reset-otp`, 300, otpCode)

		await new MailBuilder()
			.recipient(email)
			.subject('Password Change Request - Open-Fashion')
			.html(
				ForgotPasswordEmail({
					recipientName: user.firstName,
					senderName: config.MAIL_SENDER_NAME,
					otpCode
				})
			)
			.send()

		return SuccessResponse({
			res,
			statusCode: 200,
			message: 'OTP code sent to your email'
		})
	} catch (error) {
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

export const ResetPassword = async (
	req: TypedRequest<ResetPasswordPayload, EmailPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email } = req.query
		const { password, otpCode } = req.body

		const user = await UserRepository.findOne({ email })

		if (!user) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'User not found'
			})
		}

		if (!user.access) {
			return BadRequestResponse({
				res,
				statusCode: 403,
				message: 'Your access to the platform has been revoked'
			})
		}

		const verificationCode = await redisClient.get(`${email}-reset-otp`)

		if (otpCode !== verificationCode) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Invalid/expired OTP'
			})
		}

		user.password = password
		await user.save()
		await redisClient.del(`${email}-reset-otp`)

		return SuccessResponse({
			res,
			statusCode: 200,
			message: 'Reset password successful'
		})
	} catch (error) {
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}
