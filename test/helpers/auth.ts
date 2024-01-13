import request from 'supertest'
import { randFirstName, randLastName } from '@ngneat/falso'

import app from '../../src/app'
import { SigninResponse } from './../../src/app/auth'
import { UserRepository, User, UserRole } from '../../src/app/user'

export const signupUrl = '/api/v1/auth/signup'
export const signinUrl = '/api/v1/auth/signin'

export const SignupPayload = {
	email: 'lemtioh@fashion.info',
	password: 'P@ssword123!',
	firstName: randFirstName(),
	lastName: randLastName(),
	phoneNumber: '+2348023456789'
}

const { email, password } = SignupPayload

export const SigninPayload = {
	email,
	password
}

export const SignupUser = async () => {
	return await request(app).post(signupUrl).send(SignupPayload)
}

export const SigninUser = async () => {
	await SignupUser()

	const response = await request(app)
		.post(signinUrl)
		.send(SigninPayload)
		.expect(200)

	const { token, user } = response.body.data as SigninResponse

	return { token, user }
}

export const SigninAdmin = async () => {
	const payload = { ...SignupPayload, role: UserRole.ADMIN }
	const adminUser = new User(payload)

	await UserRepository.create(adminUser)
	await adminUser.save()

	const response = await request(app)
		.post(signinUrl)
		.send(SigninPayload)
		.expect(200)

	const { token, user } = response.body.data as SigninResponse

	return { token, adminUser: user }
}

export const ForgotPassword = async () => {
	const { user } = await SigninUser()

	const response = await request(app)
		.post('/api/v1/auth/forgot-password')
		.send({
			email: user.email
		})
		.expect(200)

	expect(response.body.message).toEqual('OTP code sent to your email')

	return { user }
}
