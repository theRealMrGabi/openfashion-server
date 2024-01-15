import request from 'supertest'
import { randEmail, randPassword } from '@ngneat/falso'

import app from '../../app'
import {
	signupUrl,
	SigninPayload,
	SignupUser,
	SignupPayload,
	SigninUser,
	signinUrl,
	ForgotPassword,
	RevokeUserAccess
} from '../../../test/helpers'
import { generateOTPCode } from '../../utils'

const otpCode = '730194'

jest.mock('../../utils/generateOTPCode', () => ({
	generateOTPCode: jest.fn(() => otpCode)
}))

const generateOTPCodeMock = generateOTPCode as jest.MockedFunction<
	typeof generateOTPCode
>

describe('Signup controller should', () => {
	it('return 400 error code if required fields are not passed', async () => {
		const response = await request(app).post(signupUrl).send()

		expect(response.statusCode).toBe(400)
	})

	it('successfully signup user with valid data', async () => {
		const response = await request(app).post(signupUrl).send(SignupPayload)

		expect(response.statusCode).toBe(201)
		expect(response.body.message).toEqual('Signup successful')
	})

	it('register unique email address or phone number', async () => {
		await SignupUser()

		const uniqueErrorResponse = await request(app)
			.post(signupUrl)
			.send(SignupPayload)

		expect(uniqueErrorResponse.statusCode).toBe(422)
		expect(uniqueErrorResponse.body.message).toEqual(
			'Unable to process request. Try changing details'
		)
	})
})

describe('Signin controller should', () => {
	const signinUrl = '/api/v1/auth/signin'

	it('return 400 status code if required fields are not passed', async () => {
		const response = await request(app).post(signinUrl).send()

		expect(response.statusCode).toBe(400)
	})

	it('return error when email/password does not match', async () => {
		await SignupUser()

		const response = await request(app).post(signinUrl).send({
			email: randEmail(),
			password: randPassword()
		})

		expect(response.statusCode).toBe(403)
		expect(response.body.message).toEqual('Invalid credentials')
	})

	it('return 200 statusCode for a successul login', async () => {
		await SignupUser()

		const response = await request(app).post(signinUrl).send(SigninPayload)

		expect(response.statusCode).toBe(200)
		expect(response.body).toMatchObject({
			status: true,
			message: 'Signin successful',
			data: expect.any(Object)
		})
	})
})

describe('Forgot password controller should', () => {
	const url = '/api/v1/auth/forgot-password'

	it('return 400 status code if required fields are not passed', async () => {
		const response = await request(app).post(url).send()

		expect(response.statusCode).toBe(400)
	})

	it('return error when email/user does not exist', async () => {
		await SignupUser()

		const response = await request(app).post(url).send({
			email: randEmail()
		})

		expect(response.statusCode).toBe(400)
		expect(response.body.message).toEqual('Invalid credentials')
	})

	it('throw error if user access to the platform is revoked', async () => {
		const { user } = await SigninUser()
		await RevokeUserAccess(user.id)

		const response = await request(app)
			.post(url)
			.send({
				email: user.email
			})
			.expect(403)
		expect(response.body.message).toEqual(
			'Your access to the platform has been revoked'
		)
	})

	it('successfully return a 200 and send email to user', async () => {
		const { user } = await SigninUser()

		const response = await request(app)
			.post(url)
			.send({
				email: user.email
			})
			.expect(200)

		expect(generateOTPCodeMock).toHaveBeenCalled()

		expect(response.body.message).toEqual('OTP code sent to your email')
	})
})

describe('Reset password controller should', () => {
	const url = '/api/v1/auth/reset-password'
	const urlWithFakeEmail = `${url}?email=error@xyz.biz`

	const payload = {
		password: 'P@ssword123456!',
		confirmPassword: 'P@ssword123456!'
	}

	it('throw error if email address is not passed', async () => {
		const response = await request(app).post(url).send()

		expect(response.statusCode).toBe(400)
		expect(response.body.message).toEqual('Email address is required')
	})

	it('return 400 status code if required fields are not passed', async () => {
		await request(app).post(urlWithFakeEmail).send().expect(400)
	})

	it('throw error if user is not found', async () => {
		const response = await request(app)
			.post(urlWithFakeEmail)

			.send({
				...payload,
				otpCode
			})
			.expect(400)

		expect(response.body.message).toEqual('User not found')
	})

	it('throw error if user access to the platform is revoked', async () => {
		const { user } = await SigninUser()
		const resetPasswordUrl = `${url}?email=${user.email}`

		await RevokeUserAccess(user.id)

		const response = await request(app)
			.post(resetPasswordUrl)
			.send({
				...payload,
				otpCode
			})
			.expect(403)
		expect(response.body.message).toEqual(
			'Your access to the platform has been revoked'
		)
	})

	it('throw error if wrong/invalid OTP is submitted ', async () => {
		const { user } = await SigninUser()
		const resetPasswordUrl = `${url}?email=${user.email}`

		const response = await request(app)
			.post(resetPasswordUrl)
			.send({
				...payload,
				otpCode: '123456'
			})
			.expect(400)

		expect(response.body.message).toEqual('Invalid/expired OTP')
	})

	it('successfully reset users password ', async () => {
		const { user } = await SigninUser()
		const resetPasswordUrl = `${url}?email=${user.email}`

		const response = await request(app)
			.post(resetPasswordUrl)
			.send({
				...payload,
				otpCode
			})
			.expect(200)

		expect(response.body.message).toEqual('Reset password successful')
	})

	it('use newly updated password to successfully login', async () => {
		const { user } = await ForgotPassword()
		const resetPasswordUrl = `${url}?email=${user.email}`

		const resetResponse = await request(app)
			.post(resetPasswordUrl)
			.send({
				...payload,
				otpCode
			})
			.expect(200)

		expect(resetResponse.body.message).toEqual('Reset password successful')

		const response = await request(app)
			.post(signinUrl)
			.send({
				email: user.email,
				password: payload.password
			})
			.expect(200)

		expect(response.body.message).toEqual('Signin successful')
	})

	it('throw error if you try to use a previously used OTP code', async () => {
		const { user } = await ForgotPassword()
		const resetPasswordUrl = `${url}?email=${user.email}`

		await request(app)
			.post(resetPasswordUrl)
			.send({
				...payload,
				otpCode
			})
			.expect(200)

		const resetResponse = await request(app)
			.post(resetPasswordUrl)
			.send({
				...payload,
				otpCode
			})
			.expect(400)

		expect(resetResponse.body.message).toEqual('Invalid/expired OTP')
	})
})
