import request from 'supertest'
import { randFirstName, randLastName } from '@ngneat/falso'

import app from '../../src/app'
import { SigninResponse } from './../../src/app/auth'

export const signupUrl = '/api/v1/auth/signup'
export const signinUrl = '/api/v1/auth/signin'

export const SignupPayload = {
	email: `${randFirstName()}@deecie.com`,
	password: 'P@ssword123!',
	firstName: randFirstName(),
	lastName: randLastName(),
	phoneNumber: '+2348023456789'
}

export const SigninPayload = {
	email: SignupPayload.email,
	password: SignupPayload.password
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
